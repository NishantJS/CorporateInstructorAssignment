Task
Create Api which will do the following

<ol>
<li> Create upload storage token</li>
<li> Upload file ( file can be Image , Text, Audio, Video</li>
<li> Create Audio</li>
<li> Merge Image + Audio to create video</li>
<li> Merge Video + Audio to create video</li>
<li> Merge all video</li>
<li> Download a file</li>
<li> List all uploaded file</li>
</ol>

> for local check

```
git clone https://github.com/NishantJS/CorporateInstructorAssignment.git

npm install

npm run dev

follow these steps for gcp tts:
https://github.com/googleapis/nodejs-text-to-speech#before-you-begin
```

> <h3>Api Enpoint</h3>
> 1. /create_new_storage : to store token in cookie to identify uploaded file
> 2. /upload_file : to upload file
> 3. /my_upload_file : get list of uploaded file
> 4. /text_file_to_audio : to convert text to audio  
> 5. /merge_image_and_audio : to merge image + audio to video
> 6. /merge_video_and_audio : to merge video + audio to video
> 7. /merge_all_video : to merge list of video
> 8. /download_file : to download any file from server
> <br/>

1. Create Storage Token

```
   URL : http://intern.buddyshop.in/create_new_storage
   Method : POST
   Response Body (json)
   {
   "status": "ok",
   "message": "Storage Created Successfully"
   }
   Description : It is used to Create token and store that token in client side (browser) so that all uploaded file from this users can be identified using this token .
```

2. Upload File

```
   URL : http://intern.buddyshop.in/upload_file
   Method : POST
   Request Body (form-data)
   my_file : {{Your_file}}
   Response Body (json)
   {
   "status": "ok",
   "file_path": "public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.txt"
   }
   Description : Used to upload Image file ( jpg, jpeg, png) , Text file ( txt) , Video file ( mp4) . you will have to send your file using formData with key 'my_file' . Response body will contain the path of the uploaded file .To access the file you will have concatenate domain name and file path http://intern.buddyshop.in/{{file_path}}
   Example if path of uploaded file is 'public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.png' then it can be access by http://intern.buddyshop.in/public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.png. In this way , you can access converted Audio , Video file also.
```

3. Create Audio

```
   URL : http://intern.buddyshop.in/text_file_to_audio
   Method : POST
   Request Body (json)
   {
   "file_path": "public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.txt"
   }
   Response Body (json)
   {
   "status": "ok",
   "message": "text to speech converted",
   "audio_file_path": "public/upload/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp3"
   }
# Description : Used to convert audio from uploaded text file . In Request body 'file_path' is the uploaded text file path . In Response body 'audio_file_path' is the path of converted audio file .
```

4. Merge Image and Audio

```
   URL : http://intern.buddyshop.in/merge_image_and_audio
   Method : POST
   Request Body (json)
   {
   "image_file_path": "public/upload/20a4dc79-dc67-43c9-b61c-a0e4aceb3de7.jpg" ,
   "audio_file_path": "public/upload/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp3"
   }
   Response Body (json)
   {
   "status": "ok",
   "message": "Video Created Successfully",
   "video_file_path":"public/upload/e88c28f8-9da0-4fd8-9e56-41712e24868d_voice.mp4"
   }
   Description : Used to Create Video by merging Image and Audio. In Request body
   'image_file_path' is the path of uploaded Image file , 'audio_file_path' ' is the
   path of uploaded Audio file. In Response body 'video_file_path' is the path of output video
   file.
```

5. Merge Video and Audio

```
   URL : http://intern.buddyshop.in/merge_video_and_audio
   Method : POST
   Request Body (json)
   {
   "video_file_path":"public/upload/893adf65-9c49-4d74-9add-36ca23c6361c.mp4",
   "audio_file_path": "public/upload/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp3"
   }
   Response Body (json)
   {
   "status": "ok",
   "message": "Video and Audio Merged Successfully",
   "video_file_path": "public/upload/d9141df7-557d-4862-ae28-7d72909ca78b.mp4"
   }
   Description : Used to Create Video by Replacing Audio in video with given Audio . In Request body 'video_file_path' is the path of uploaded video file , 'audio_file_path' ' is the path of uploaded Audio file. In Response body 'video_file_path' is the path of output video file.
```

6. Merge All Video

```
   URL : http://intern.buddyshop.in/merge_all_video
   Method : POST
   Request Body (json)
   {
   "video_file_path_list": [
   "public/upload/893adf65-9c49-4d74-9add-36ca23c6361c.mp4",
   "public/upload/8sda23df65-9c49-4d74-9add-36daaa2341c.mp4",
   "public/upload/7f55e680-67dc-4721-ba45-a8a738c68e5a.mp4"
   ]
   }

Response Body (json)
{
"status": "ok",
"message": "Merged All Video Successfully",
"video_file_path": "public/upload/4a1ef1cd-7ec9-4ffc-bb8b-e8f0ccac341c.mp4"
}
Description : Used to merge multiple videos . In Request body
'video_file_path_list' is the array contain the list of video file path . Video will be merge
according to the index of video files in 'video_file_path_list' . In Response body
'video_file_path' is the path of output video file. you can use FFmpeg to merge mulitple video
 into single video.
```

7. Download File

```
  URL : http://intern.buddyshop.in/download_file
  Method : GET
  Request Query (query-string)
  file_path=public/upload/5214c459-47d5-434f-8c25-cce3a5f47ff7.mp4

Response
file will start downloading

Description : Used to download existing file from server . if you want to download any existing file from server then you can send get request to the server and it will download the file . you download file by going to url 'http://intern.buddyshop.in/download_file?file_path={{existing_file_path_in_server}}

Example
if you file path is 'public/upload/5214c459-47d5-434f-8c25-cce3a5f47ff7.mp4' then you can download it by opening url http://intern.buddyshop.in/download_file?file_path=public/upload/5214c459-47d5-434f-8c25-cce3a5f47ff7.mp4 in browser
```

8. List All Uploaded Files

```
   URL : http://intern.buddyshop.in/my_upload_file
   Method : GET
   Response
   {
   "status": "ok",
   "data": [
   "9c5ff995-23c0-418a-8ed4-a5da9c10fd37-10fcfc4e-fa8e-404a-bfdd-422f68beb2a2.png",
   "9c5ff995-23c0-418a-8ed4-a5da9c10fd37-f8b34592-3c46-456d-9d86-26de6e6daa35.txt"
   ]
   }
   Description : Used to List All uploaded files by user. 'data' field contain the array of all uploaded
   file paths
```
