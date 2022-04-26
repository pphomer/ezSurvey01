import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './cust.css';

function example_image_upload_handler(blobInfo, success, failure, progress) {
  var xhr, formData;

  xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', '/api/uploadFile');

  xhr.upload.onprogress = function (e) {
    progress(e.loaded / e.total * 100);
  };

  xhr.onload = function () {
    var json;

    if (xhr.status === 403) {
      failure('HTTP Error: ' + xhr.status, { remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      const { detail } = JSON.parse(xhr.response);
      failure('HTTP Error：' + detail);
      //console.log("xhr", detail);
      return;
    }

    json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != 'string') {
      failure('Invalid JSON: ' + xhr.responseText);
      return;
    }

    success(json.location);
  };

  xhr.onerror = function () {
    failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };

  //console.log("images_upload_handler blobInfo #### ", blobInfo, blobInfo.blob().size);

  formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
};

export default function TinyFunc(props) {
  const { name, value, onChange, placeholder="" } = props;
  const editorRef = useRef(null);
  
  const getContent = () => {
    let _content = "";
    if (editorRef.current) {
      _content = editorRef.current.getContent();
    }
    return _content;
  };


  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={value}
      // value={tmpValue} //  Uncaught TypeError....
      init={{
        min_height: 140,
        max_height: 560,
        menubar: false,
        language: "zh_TW",
        relative_urls: false, // for image url
        inline: true, // onfocus 才會出現 toolbar
        placeholder: placeholder,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount autoresize'
        ],
        toolbar1: 'undo redo | formatselect | ', 
        toolbar2: 'bold italic forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help', // imgadd , if custome icon needed
        /*content_style: '.mce-content-body { padding: 0.375rem 0.75rem }',*/
        // https://www.tiny.cloud/blog/tinymce-margins-line-height-spacing/
        // https://www.tiny.cloud/docs/configure/content-appearance/#content_style
        branding: false,
        images_upload_handler: example_image_upload_handler,
        automatic_uploads: true,
        autoresize_bottom_margin: 60,
        //setup: function (editor) {
        //  editor.on('init', function () {
        //    this.setContent(value);
        //    //this.save();
        //  })
        //}
      }}
      onBlur={() => {
        //console.log("tinymce onBlur");
        onChange({ target: { name, value: getContent() } });
      }}
      //onFocusOut={() => { 點 icon 也會觸發, 造成cursor跑掉 }}
    />
  );
}


