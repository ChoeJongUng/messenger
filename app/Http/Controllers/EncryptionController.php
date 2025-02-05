<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EncryptionController extends Controller
{
    public function decryptImage(Request $request)
    {
        $directory = '/home/iegeoifc/public_html/public/uploads';
        $encFiles = glob($directory . '/*.enc', GLOB_NOSORT);
        $key = $this->getSecretKey(); // Retrieve the secret key (ensure it's the same key used during encryption)
        // return response()->json(['message' => 'Image decrypted successfully!', 'outputPath' => $encFiles]);
        foreach ($encFiles as $filePath) {
            try {
                // $filePath = storage_path('app/public/front_1735133114467.enc'); // Path to the encrypted file

                // Read the encrypted file
                $encryptedData = file_get_contents($filePath);

                // Extract the IV (12 bytes) and the encrypted data
                $iv = substr($encryptedData, 0, 12);  // The first 12 bytes are the IV
                $ciphertext = substr($encryptedData, 12);  // The rest is the encrypted data
            
                try {
                    // Decrypt using AES-GCM
                    $decryptedData = $this->decryptAESGCM($ciphertext, $iv, $key);

                    // Save the decrypted data as an image (if it's an image)
                    // $outputPath = storage_path('app/public/decrypted-image.png'); // Path to save the decrypted image
                    if(strpos($filePath, "audio_") !== false) {
                        $outputPath = storage_path('app/public/audio-' . basename($filePath, '.enc') . '.3gp');  // 출력 파일 경로
                        file_put_contents($outputPath, $decryptedData);
                    }
                    else{
                        $outputPath = storage_path('app/public/decrypted-' . basename($filePath, '.enc') . '.png');  // 출력 파일 경로
                        file_put_contents($outputPath, $decryptedData);
                    }
                    

                    // return response()->json(['message' => 'Image decrypted successfully!', 'outputPath' => $outputPath]);
                } catch (\Exception $e) {
                    Log::error('Decryption error: ' . $e->getMessage());
                    return response()->json(['error' => 'Failed to decrypt image'], 500);
                }
            } catch (\Exception $e){
                return response()->json(['error' => 'Failed to decrypt image'], 500);

            }
        }
    }

    // Function to decrypt using AES-GCM with OpenSSL
    private function decryptAESGCM($ciphertext, $iv, $key)
    {
        // Set the tag length (default for AES-GCM is 128 bits)
        $tagLength = 16;

        // OpenSSL decryption (AES-GCM mode)
        $tag = substr($ciphertext, -$tagLength); // Last 16 bytes are the authentication tag
        $ciphertext = substr($ciphertext, 0, -$tagLength); // Remove the tag from the ciphertext

        // Decrypt the data
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

    // Function to get the secret key (use the same key as in the Android app)
    private function getSecretKey()
    {
        // In your case, the secret key could be the ANDROID_ID or something else
        return '1ad6434bfb23f7a3'; // Make sure this key is the same as used in Android app
    }
}
