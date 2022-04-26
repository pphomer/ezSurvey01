import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import DatePicker from "react-datepicker";
import { MdOutlineDeleteForever } from 'react-icons/md';
import useQNRContext from '../../common/useHooks/QNRContext';
import { useManageSettings } from '../../common/useHooks/useAppSetting';
import { FormGroupRow } from '../../components/FormGroupRow';
import TinyFunc from '../../components/tinyFunc';
import useWarning from '../useHooks/useWarning';


// https://reactdatepicker.com/#example-custom-date-format


export const Title = ({ required = false }) => {
  const name = "title"
  const { state, handleChange } = useQNRContext();
  const { warning, message } = useWarning(name);
  const [localValue, updateLocalValue] = useState("");

  useEffect(() => {
    updateLocalValue(state[name] || "")
  }, [state[name]])

  return (
    <div className="form-group">
      <label className="required">表單名稱</label>
      <input type="text"
        className={`form-control form-control-lg title ${warning}`}
        name={name}
        value={localValue}
        placeholder="表單名稱"
        onChange={(event) => updateLocalValue(event.target.value)}
        onBlur={handleChange}
        required
        maxLength={300} />
    </div>
  )
}

export const Title1 = ({ required = false }) => {
  const name = "title"
  const { state, handleChange } = useQNRContext();
  const { warning, message } = useWarning(name);
  const [localValue, updateLocalValue] = useState("");

  useEffect(() => {
    updateLocalValue(state[name] || "")
  }, [state[name]])

  return (
    <>
      <FormGroupRow label="表單名稱" className="align-items-center" required={required} warning={warning}>
        <input type="text"
          name={name}
          className={`form-control ${warning}`}
          value={localValue}
          placeholder="表單名稱"
          onChange={(event) => updateLocalValue(event.target.value)}
          onBlur={handleChange}
          required
          maxLength={300}
        />
      </FormGroupRow>
    </>
  )
}


export const ExamDatePicker = ({ name, readOnly = false }) => {

  const { state, updateState } = useQNRContext();
  const { warning } = useWarning(name);
  
  return (
    <>
      <DatePicker selected={Date.parse(state[name])} 
        onChange={date => { updateState({ [name]: date }) }}
        showTimeSelect
        dateFormat="yyyy/MM/dd HH:mm"
        className={`${warning} `}
        readOnly={readOnly}
        id={name}
        wrapperClassName="w-auto"
      />
    </>
  )
}

export const ExamDateRange = ({ required = undefined }) => {

  const startDate = "startDate";
  const endDate = "endDate";

  const { warning: startWarning, message: m1 } = useWarning(startDate);
  const { warning: endWarning, message: m2 } = useWarning(endDate);

  return (
    <div className="form-group mb-3">
      <label className="required">填寫起訖</label>
      <div><ExamDatePicker name={startDate} /> ~ <ExamDatePicker name={endDate} /></div>
    </div>
  )
}

const matchsize = (file, maxsizeKB) => {
  //const clientSettings = useClientSettings();
  //const maxsizeKB = clientSettings.bannerImgMaxSize;
  const fsizeKB = sizeKB(file);
  return fsizeKB > 0 && fsizeKB <= maxsizeKB;
}

const sizeKB = (file) => {
  return file && Math.floor(file.size / 1024);
}

export const BannerImgPicker = () => {

  const nofiletext = "未選擇任何檔案";

  const [imgname, setimgname] = useState(nofiletext);
  const [delIcon, setDelIcon] = useState(false);
  const [imgsrc, setImgsrc] = useState("");
  const { state, updateState } = useQNRContext();
  const { bannerImgMaxSize: maxsizeKB, bannerImgSizeUnit: sizeUnit } = useManageSettings();

  useEffect(() => {
    let imgname = nofiletext;
    if (state.bannerImg_Url) {
      setDelIcon(true);
      setImgsrc(state.bannerImg_Url);
      imgname = state.bannerImg_clientName || "banner圖檔";
    }
    setimgname(imgname)
  }, [state.banner_img])


  const onChange = (event) => {
    const newBannerImg = event.target.files[0]
    event.target.value = null;

    if (matchsize(newBannerImg, maxsizeKB)) {
      updateState({
        newBannerImg,
        bannerImgDeleted: true
      })
      setImgsrc(URL.createObjectURL(newBannerImg));
      setDelIcon(true);
      setimgname(newBannerImg.name);
    } else {
      alert(`超過檔案大小限制：${maxsizeKB}${sizeUnit}，請換一個．`);
    }

    console.log("file onChange");
  }

  const onDelete = () => {

    updateState({
      newBannerImg: null,
      bannerImgDeleted: true
    })
    setImgsrc("");
    setDelIcon(false);
    setimgname(nofiletext);
  }

  return (
    <div>

      <FormGroupRow label="Banner圖片上傳">
        <div>
          <label className="btn btn-primary" htmlFor="bannerImg">選擇檔案</label>
          <input type="file" id="bannerImg"
            onChange={onChange}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }} />
          <label style={{ padding: "3px 10px" }} >{imgname}</label>
          <span className={"icon h2 "}>
            <MdOutlineDeleteForever style={{ display: `${delIcon ? 'inline' : 'none'}` }} onClick={onDelete} />
          </span>          
        </div>
        <div className="row">
          {imgsrc && <img src={imgsrc} width={960} height={100} />}
        </div>

      </FormGroupRow>
    </div>
  )
}

export const BannerImg = () => {
  const nofiletext = "未選擇任何檔案";
  const [imgname, setimgname] = useState(nofiletext);
  const [delIcon, setDelIcon] = useState(false);
  const [imgsrc, setImgsrc] = useState("");
  const { state, updateState } = useQNRContext();
  const { bannerImgMaxSize: maxsizeKB, bannerImgSizeUnit: sizeUnit } = useManageSettings();

  useEffect(() => {
    let imgname = nofiletext;
    if (state.bannerImg_Url) {
      setDelIcon(true);
      setImgsrc(state.bannerImg_Url);
      imgname = state.bannerImg_clientName || "banner圖檔";
    }
    setimgname(imgname)
  }, [state.banner_img])


  const onChange = (event) => {
    const newBannerImg = event.target.files[0]
    event.target.value = null;

    //console.log("onChange", event);

    if (matchsize(newBannerImg, maxsizeKB)) {
      updateState({
        newBannerImg,
        bannerImgDeleted: true
      })
      setImgsrc(URL.createObjectURL(newBannerImg));
      setDelIcon(true);
      setimgname(newBannerImg.name);
    } else {
      alert(`超過檔案大小限制：${maxsizeKB}${sizeUnit}，請換一個．`);
    }

    console.log("file onChange");
  }

  const onDelete = () => {
    updateState({
      newBannerImg: null,
      bannerImgDeleted: true
    })
    setImgsrc("");
    setDelIcon(false);
    setimgname(nofiletext);
  }

  const imgbaks = [
    "https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_960_720.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXhI5ZfFhBY9bR3dJ6-Wsza8ZTRLIGqoLd-g&usqp=CAU"
  ];
  

  return (<>
    <section className="banner_img">
      <img src={imgbaks[1]} />

      <div className="d-none">
    <label htmlFor="bannerImg1">
      <MdOutlinePhotoSizeSelectActual />
    </label>

    <span className={"icon h2 "}>
      <MdOutlineDeleteForever style={{ display: `${delIcon ? 'inline' : 'none'}` }} onClick={onDelete} />
    </span>

    <input type="file" id="bannerImg1"
      onChange={onChange}
      accept="image/png, image/jpeg"
        style={{ display: 'none' }} />
      </div>
    </section>
  </>)
}

export const Description = () => {
  const name = "description";
  const { state, handleChange } = useQNRContext();
  const value = state[name];
  return (
    <div>
      {/*<label className="form-label">表單說明</label>*/}
      <TinyFunc name={name}
        value={value}
        onChange={handleChange}
        placeholder="說明"
      />
    </div >
  )
}


