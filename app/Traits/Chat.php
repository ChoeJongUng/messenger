<?php

namespace App\Traits;

use App\Models\ChatContact;
use App\Models\ChatGroup;
use App\Models\ChatMessage;
use App\Models\ChatMessageFile;
use App\Models\GroupMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

trait Chat
{
    protected $validImageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
    protected $linkPattern = "/(https?:\/\/[^\s]+)/";

    public function chats() 
    {
        $specificFromId = "9e27d661-7fd9-44d3-accf-04d8188b58c8";
        $group = ChatGroup::select('id as group_id');
        $search = request('query');
    
        $searchQuery = request('query'); // 사용자가 입력한 검색어

        $latestMessage = $this->latestMessageForEachChat($group);

        $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
            ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                $join->on('chat_messages.sort_id', 'lm.sort_id')
                    ->on(function (JoinClause $join) {
                        $join->on('chat_messages.from_id', 'lm.another_user_id')
                            ->orOn('chat_messages.to_id', 'lm.another_user_id');
                    });
            })
            ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                $join->on('ac.from_id', 'lm.another_user_id')
                    ->where('ac.archived_by', auth()->id());
            })
            ->when(request()->filled('archived_chats'), 
                fn ($query) => $query->whereNotNull('ac.id'),
                fn ($query) => $query->whereNull('ac.id')
            )
            ->leftJoin('users as u', 'lm.another_user_id', '=', 'u.id') // 개인 채팅 사용자 매칭
            ->leftJoin('chat_groups as cg', 'lm.another_user_id', '=', 'cg.id') // 그룹 채팅 매칭
            ->when(!empty($searchQuery), function ($query) use ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('u.name', 'like', "%{$searchQuery}%") // 개인 사용자 검색
                    ->orWhere('cg.name', 'like', "%{$searchQuery}%"); // 그룹 검색
                });
            })
            ->select('chat_messages.*', 'lm.another_user_id')
            ->orderByRaw("CASE WHEN chat_messages.from_id = ? THEN 0 ELSE 1 END", [$specificFromId]) // Prioritize specific from_id
            ->orderByDesc('sort_id')
            ->paginate(15)
            ->setPath(route('chats.users'));

                

            foreach ($chats as $key => $chat) {
                $from = $chat->from_id === auth()->id() ? '나: ' : '';
                $attachment = '';
                if (!$chat->body && $chat->attachments) {
                    $fileName = $chat->attachments->first()?->original_name;
                    if (in_array(pathinfo($fileName, PATHINFO_EXTENSION), $this->validImageExtensions)) {
                        $attachment = '<div class="flex items-center gap-1">'. $from . ChatMessage::SVG_IMAGE_ATTACHMENT .' Photo</div>';
                    } else {
                        $attachment = '<div class="flex items-center gap-1">'. $from . ChatMessage::SVG_FILE_ATTACHMENT .' File</div>';
                    }
                }

                $mapped = new \stdClass;
                $seenInId = collect(json_decode($chat->seen_in_id));

                if ($chat->to instanceof User) {
                    $mapped->id = $chat->another_user->id;
                    $mapped->name = $chat->another_user->name . ($chat->another_user->id === auth()->id() ? ' (나)' : '');
                    $mapped->avatar = $chat->another_user->avatar;
                    $mapped->from_id = $chat->from_id;
                    $mapped->is_read = $seenInId->filter(fn ($item) => $item->id === auth()->id())->count() > 0;
                    $mapped->is_reply = $chat->another_user->id === $chat->from_id;
                    $mapped->description = $chat->description;
                    $mapped->description = $chat->description;
                    $mapped->is_online = $chat->another_user->is_online == true;
                    $mapped->is_contact_blocked = auth()->user()->is_contact_blocked($chat->another_user->id);
                    $mapped->chat_type = ChatMessage::CHAT_TYPE;
                    $mapped->created_at = $chat->created_at;

                    $mapped->body = $chat->body
                    ? $from . \Str::limit(strip_tags($chat->body), 100)
                    : $attachment;
                } else {
                    $mapped->id = $chat->to->id;
                    $mapped->name = $from.$chat->to->name;
                    $mapped->avatar = $chat->to->avatar;
                    $mapped->from_id = $chat->from_id;
                    $mapped->is_read = $seenInId->filter(fn ($item) => $item->id === auth()->id())->count() > 0;
                    $mapped->is_reply = $chat->from_id !== auth()->id();
                    $mapped->is_online = false;
                    $mapped->is_contact_blocked = false;
                    $mapped->chat_type = ChatMessage::CHAT_GROUP_TYPE;
                    $description = DB::table('chat_groups')->where('id',$chat->to->id)->first()->description;
                    $mapped->description = \Str::limit(strip_tags($description), 100);

                    $mapped->created_at = $chat->created_at;

                    if (str_contains($chat->body, 'created group "'. $chat->to->name .'"') && $chat->to->creator_id !== auth()->id()) {
                        $mapped->body = 'You: invited by ' . $chat->to?->creator?->name;
                    } else {
                        $mapped->body = $chat->body
                        ? $from . \Str::limit(strip_tags($chat->body), 100)
                        : $attachment;
                    }
                }

                $chats[$key] = $mapped;
            }
        // }

        return $chats;
    }



    public function latestMessageForEachChat($group) 
    {
        $latestMessage = ChatMessage::leftJoinSub($group, 'g', function (JoinClause $join) {
                $join->on('chat_messages.to_id', 'g.group_id');
            })
            ->where(function (Builder $query) use ($group) {
                $query->where(function (Builder $query) {
                        $query->where('from_id', auth()->id())
                              ->whereNot('to_id', auth()->id());
                    })
                    ->orWhere(function (Builder $query) {
                        $query->where('to_id', auth()->id())
                              ->whereNot('from_id', auth()->id());
                    })
                    ->orWhere(function (Builder $query) { // chat to self
                        $query->where('from_id', auth()->id())
                              ->where('to_id', auth()->id());
                    })
                    ->orWhereIn('to_id', $group->pluck('group_id')->toArray()); // chat to group
            })
            ->deletedInIds()
            ->selectRaw("
                MAX(sort_id) as sort_id,
                CASE
                    WHEN g.group_id IS NOT NULL THEN chat_messages.to_id
                    WHEN from_id = '". auth()->id() ."' THEN to_id
                    ELSE from_id
                END as another_user_id
            ")
            ->groupBy('another_user_id');

        return $latestMessage;
    }

    public function notificationCount() 
    {
        if (!auth()->check()) return 0;

        $group = ChatGroup::select('id as group_id'); 
        $latestMessage = $this->latestMessageForEachChat($group);

        $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
            ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                $join->on('chat_messages.sort_id', 'lm.sort_id')
                    ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lm.another_user_id')
                                ->orOn('chat_messages.to_id', 'lm.another_user_id');
                    });
            })
            ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                $join->on('ac.from_id', 'lm.another_user_id')
                    ->where('ac.archived_by', auth()->id());
            })
            ->where(function (Builder $query) {
                $query->where('chat_messages.from_id', auth()->id())
                    ->orWhere('chat_messages.to_id', auth()->id());
            })
            ->whereNotIn('chat_messages.to_id', ChatGroup::pluck('id')->toArray()) // Exclude group chats
            ->notSeen()
            ->whereNull('ac.id')
            ->selectRaw('1')
            ->count();
            
        return $chats;
    }
    public function notificationCountGroup() 
    {
        if (!auth()->check()) return 0;

        $group = ChatGroup::select('id as group_id'); 
        $latestMessage = $this->latestMessageForEachChat($group);

        $groupChats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
            ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                $join->on('chat_messages.sort_id', 'lm.sort_id')
                    ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lm.another_user_id')
                                ->orOn('chat_messages.to_id', 'lm.another_user_id');
                    });
            })
            ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                $join->on('ac.from_id', 'lm.another_user_id')
                    ->where('ac.archived_by', auth()->id());
            })
            ->whereIn('chat_messages.to_id', ChatGroup::pluck('id')->toArray()) // **Include only group chats**
            ->notSeen()
            ->whereNull('ac.id')
            ->selectRaw('1')
            ->count();
            
        return $groupChats;
    }

    public function messages(string $id) 
    {
        $chats = ChatMessage::with([
                'from',
                'to',
                'attachments' => fn ($query) => $query->with('sent_by')->deletedInIds()
            ])
            ->forUserOrGroup($id)
            ->deletedInIds()
            ->selectRaw('
                id, 
                from_id, 
                to_id, 
                to_type, 
                IF (to_type = ?, ?, ?) as chat_type, 
                body, 
                seen_in_id, 
                sort_id, 
                created_at', 
                [
                    User::class,
                    ChatMessage::CHAT_TYPE,
                    ChatMessage::CHAT_GROUP_TYPE
                ]
            )
            ->orderByDesc('sort_id')
            ->paginate(25)
            ->setPath(route('chats.messages', $id));

        foreach ($chats as $key => $chat) {
            $result = preg_match_all($this->linkPattern, $chat->body, $matches);
    
            if ($result > 0) {
                $chat->links = $matches[0];
            } else {
                $chat->links = [];
            }

            $chats[$key] = $chat;
        }
        return $chats;
    }

    public function media(string $id, $type = 'media') 
    {
        $chatIds = ChatMessage::forUserOrGroup($id)
            ->deletedInIds()
            ->pluck('id')
            ->toArray();

        $files = ChatMessageFile::with('sent_by')
            ->deletedInIds()
            ->whereIn('chat_id', $chatIds)
            ->where('file_type', $type)
            ->get();

        return $files;
    }

    public function files(string $id) 
    {
        return $this->media($id, 'files');
    }

    public function links(string $id) 
    {
        $chats = ChatMessage::forUserOrGroup($id)
            ->deletedInIds()
            ->whereRaw("body REGEXP 'https?:\/\/[^\\s]+'")
            ->orderByDesc('sort_id')
            ->pluck('body');

        foreach ($chats as $key => $link) {
            $result = preg_match_all($this->linkPattern, $link, $matches);

            if ($result > 0) {
                $chats[$key] = $matches[0];
            }
        }

        return $chats->flatten();
    }
}
