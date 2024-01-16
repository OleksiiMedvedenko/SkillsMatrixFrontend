import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import "./../../style/formStyle.css";
//components 
import Loading from '../Loading';
import Error from '../Error';
//endpoint
import { REACT_APP_API_URL } from '../../env';
//colors 
import { generateRandomColor } from '../../theme';
//service api
import useFetch from '../../service/getApi';
import usePost from '../../service/postApi';
//alerts
import Alerts from '../../components/Alerts';

const getCurrentFormatedDate = (inputDate) => {
	const currentDate = new Date(inputDate);
	const day = String(currentDate.getDate()).padStart(2, '0');
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const year = currentDate.getFullYear();
	const formattedDate = `${day}.${month}.${year}`;
	return formattedDate;
}

const AuditCompletedForm = () => {
	const historyId = JSON.parse(localStorage.getItem('completedFormHistoryId'));

	const [template, setTemplate] = React.useState([]);
	const [auditStatus, setAuditStatus] = React.useState();

	const { data: templateData, loading: templateLoading, error: templateError } = useFetch(REACT_APP_API_URL + "Form/getCompletedTemplate/" + historyId);
	const {data: header} = useFetch(REACT_APP_API_URL + "Form/getHeader/" + template[0]?.TemplateForm?.TemplateId);

	const totalSum = template.reduce((accumulator, currentItem) => {
		return accumulator + currentItem.Value;
	}, 0);

	const minPoints = template.reduce((accumulator, currentItem) => {
		return accumulator + currentItem?.TemplateForm?.Question?.MinValue;
	}, 0);
	
	useEffect(() => {
	  async function fetchTemplate() {
		try {
		  setTemplate(templateData);
		} catch (err) {
		  console.log('Error fetching template data');
		}
	  }
	  fetchTemplate();
	}, [templateData]);



	if (templateError.length > 0 ) {
	    return <Error err={templateError} />;
	}
	if (templateLoading) {return <Loading />;}

//start main content 
	let prevGroupName = null;
	let currentGroupName = null;
	const rows = [];

	template?.forEach((item, index) => {
		const showGroupName = item?.TemplateForm?.Question?.GroupName !== prevGroupName;
		currentGroupName = item?.TemplateForm?.Question?.GroupName;
	
		if (showGroupName) {
		  prevGroupName = item?.TemplateForm?.Question?.GroupName;
		}

		rows.push(
		  <tr key={index} style={{ height: `77px` }}>
			{showGroupName && (
			  <td className="main-section-cell" bgcolor={generateRandomColor()} rowSpan={template.filter(item => item?.TemplateForm?.Question?.GroupName === currentGroupName)?.length}>
				{item?.TemplateForm?.Question?.GroupName}
			  </td>
			)}
			<td className="main-question-cell">{index + 1}</td>
			<td colSpan="21">{`${item?.TemplateForm?.Question?.Topic}`}</td>
			<td className="main-score-cell" colSpan="2">
			  {item?.TemplateForm?.Question?.MinValue}
			</td>
			<td className="main-score-cell" colSpan="2">
				{item?.Value}
			</td> 
			<td className="comment-cell" colSpan="26">
				{item?.Comment}
			</td>
		  </tr>
		);
	});

	console.log(template)
	console.log(historyId)

    return(
		<table className="" cellSpacing={0} border={1}>
			<tbody>
{/* <!-- start form info --> */}
				<tr style={{ height: "24px"}}>
					<td colSpan="2" rowSpan="2" className="form-info-image-cell">
						<img alt="form-logo"
							width="70%"
							height="70%"
							src={`../../assets/formLogo.png`}
							style={{ cursor: "pointer"}}/>
					</td>
					<td colSpan="6" rowSpan="3" className="form-info-title-cell ">
						Formularz audytu stanowiskowego
					</td>
					<td colSpan="2" rowSpan="2" className="form-info-page-number-cell">
						Str 1 z 1
					</td>
				</tr>

				<tr style={{ height: "24px"}} />

				<tr className="content-row">
					<td colSpan="2" className="form-info-green-cell">
						{header?.UniqueIdentifier}
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						Zał.do
					</td>
				</tr>

				<tr className="content-row">
					<td colSpan="2" className="form-info-normal-cell">
						Sporządził
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						Sprawdził
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						Zatwierdził
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						Data utworzenia
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						Data zmiany
					</td>
				</tr>
				<tr className="content-row">
					<td colSpan="2" className="form-info-normal-cell">
						{header?.Drafted}
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						{header?.Checked}
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						{header?.Approved}
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						21.02.2022
					</td>
					<td colSpan="2" className="form-info-normal-cell">
						{header?.DateChange}
					</td>
				</tr>
{/* <!-- end form info -->
<!-- start enter data Hala, dział --> */}
				<tr style={{ height: "30px"}}/>

				<tr className="info-table-row-height">
					<td className="info-table-cell-style" colSpan="4" rowSpan="2">
						<img alt="form-logo"
								width="40%"
								height="40%"
								src={`../../assets/formLogo.png`}
								style={{ cursor: "pointer"}}/>
					</td>
					{/* <td className="info-table-cell-header-style">
							<nobr>Hala:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="1">
							<nobr>MK</nobr>
					</td> */}
					<td className="info-table-cell-header-style">
							<nobr>Dział:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="5">
							<nobr>{template[0]?.Audited?.Department?.Name}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="2">
							<nobr>Data:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="3">
							<nobr>{getCurrentFormatedDate(template[0]?.TemplateForm?.CreatedDate)}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="4">
							<nobr>Audytor:</nobr>
					</td>
					<td className="info-table-cell-empty-style" colSpan="7">
							<nobr>{template[0]?.Auditor?.FullName}</nobr>
					</td>
					<td className="info-table-cell-audit-status" colSpan="12" style={{ textAlign: "center" }} rowSpan="2">
							<nobr>{totalSum >= minPoints ? (totalSum >= header?.Division ? 'Audyt zaliczony na poziom 2' : 'Audyt zaliczony na poziom 1') : 'Audyt niezaliczony'}</nobr>
					</td>
					<td className="info-table-cell-points-style" colSpan="6">
							<nobr>ilość uzyskanych punktów</nobr>
					</td>
				</tr>

				<tr className="row-height">
					<td className="info-table-cell-header-style" colSpan="2">
							<nobr>Stanowisko:</nobr>
					</td>
					<td className="info-table-cell-empty-style" colSpan="4">
							<nobr>{template[0]?.Audited?.Position?.Name}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="2">
							<nobr>Linia:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="3">
							<nobr>{template[0]?.Line}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="4">
							<nobr>Audytowany:</nobr>
					</td>
					<td className="info-table-cell-empty-style" colSpan="7">
							<nobr>{template[0]?.Audited?.Employee?.FullName}</nobr>
					</td>
					<td className="info-table-cell-audit-status" bgcolor="#f23d3d" colSpan="6" rowSpan="1">
							<nobr>{totalSum}</nobr>
					</td>
				</tr>
{/* <!-- end enter data Hala, dział -->
<!-- start Table --> */}
				<tr className="header-row">
					<td className="main-header-cell" colSpan="53">
						AUDYT STANOWISKOWY
					</td>
				</tr>
				<tr className="question-row">
					<td className="main-question-cell" colSpan="23" rowSpan="2">
						Pytania kontrolne
					</td>
					<td className="main-score-header-cell" colSpan="4">
						Skala punktowa <br/> od 0 do 2
					</td>
					<td className="main-question-cell" colSpan="26" rowSpan="2">
						Komentarze / Uwagi / Sugestie Audytora
					</td>
				</tr>
				<tr className="score-row">
					<td className="main-score-header-cell" colSpan="2">
						Minimalna ilość pkt.
					</td>
					<td className="main-score-header-cell" colSpan="2">
						Uzyskana ilość pkt.
					</td>
				</tr>
{/* <!-- questions --> */}
				{rows}
{/* <!-- end Table --> */}
				<tr style={{ height: "31px"}}>
					<td bgcolor="#99CC00" style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", border: "1px solid", minWidth: "50px"}} colSpan={53}>
						<nobr>Czy widzisz pozytywne, dobre praktyki na stanowisku pracy?</nobr>
					</td>
				</tr>
{/* <!-- start Scale table  --> */}
				<tr style={{ height: "24px"}} />

				<tr>
					<th className="scale-description" colSpan="5">Skala punktowa:</th>
					<th className="scale-description" colSpan="3" style={{border: "none"}}></th>
					<th className="scale-description" colSpan={1 + template?.length}>Zaliczenie audytu po zakończonym szkoleniu uprawnia do uzyskania odpowiedniego poziomu w Matrycy Kompetencji.</th>
				</tr>
				<tr className="point-scale-table">
					<td className="range" bgcolor="#ed5368">0-{minPoints}</td>
					<td colSpan="4">audyt niezaliczony</td>
					<td colSpan="3" style={{border: "none"}}></td>
					<td colSpan="1" style={{fontWeight: "bold"}}>numer pytania</td>
					{template.map((item, i) => (
						<td bgcolor="#b4b5b1" key={i} colSpan="1">{i + 1}</td>
					))}
				</tr>
				<tr className="point-scale-table">
					<td className="range" bgcolor="#e8c123">{minPoints + 1}-{header?.Division}</td>
					<td colSpan="4">audyt zaliczony na poziom 1</td>
					<td colSpan="3" style={{border: "none"}}></td>
					<td colSpan="1" style={{fontWeight: "bold"}}>ocena minimalna</td>
					{template.map((item, i) => (
						<td key={i} style={item?.TemplateForm?.Question?.MinValue === 2 ? {fontWeight: "bold"} : {fontWeight: "normal"}} bgcolor={item?.TemplateForm?.Question?.MinValue === 1 ? "#7babed" : "#1f5bad"} colSpan="1">{item?.TemplateForm?.Question?.MinValue}</td>
					))}
				</tr>
				<tr className="point-scale-table">
					<td className="range" bgcolor="#35ba29">{header?.Division + 1} - {template.length * 2}</td>
					<td colSpan="4">audyt zaliczony na poziom 2</td>
					<td colSpan="3" style={{border: "none"}}></td>
					<td colSpan="1" style={{fontWeight: "bold"}}>ocena maksymalna</td>
					{template.map((item, i) => (
						<td key={i} style={item?.TemplateForm?.Question?.MinValue === 2 ? {fontWeight: "bold"} : {fontWeight: "normal"}} bgcolor={item?.TemplateForm?.Question?.MinValue === 1 ? "#7babed" : "#1f5bad"} colSpan="1">{2}</td>
					))}
				</tr>
				<tr>
					<td colSpan="8" style={{border: "none"}}></td>
					<td colSpan={1 + template?.length} style={{fontWeight: "bold", color: "red", textAlign: "center"}}>STWIERDZENIE NIEZGODNOŚCI W PKT. 6 I 7 POWODUJE NIEZALICZENIE AUDYTU.</td>
				</tr>
{/* <!-- end Scale table  --> */}


{/* <!-- start Two scale tables  -->  */}
				<tr style={{height: "30px"}}/>

				<tr>
					<th className="scale-description" colSpan="4">Skala 0-1</th>
				</tr>
				<tr className="point-scale-table">
					<td className="range">0</td>
					<td colSpan="3">pracownik nie udzielił odpowiedzi</td>
				</tr>
				<tr className="point-scale-table">
					<td className="range">0.5</td>
					<td colSpan="3">pracownik udzielił niepełnej odpowiedzi</td>
				</tr>
				<tr className="point-scale-table">
					<td className="range">1</td>
					<td colSpan="3">pracownik udzielił odpowiedz </td>
				</tr>

				<tr style={{height: "30px"}}/>

				<tr>
					<th className="scale-description" colSpan="4">Skala 0-2</th>
				</tr>
				<tr className="point-scale-table">
					<td className="range">0</td>
					<td colSpan="3">pracownik nie udzielił odpowiedzi</td>
				</tr>
				<tr className="point-scale-table">
					<td className="range">1</td>
					<td colSpan="3">pracownik udzielił niepełnej odpowiedzi</td>
				</tr>
				<tr className="point-scale-table">
					<td className="range">2</td>
					<td colSpan="3">pracownik udzielił odpowiedz </td>
				</tr>
{/* <!-- start Two scale tables  --> */}

				{template?.length < 1 && (
					<Alerts severity="warning" message="Formularz dla tego audytu nie istnieje.(Audyt przeprowadzany bez formularza)" />
				)}
			</tbody>
		</table>
    );
}

export default AuditCompletedForm;