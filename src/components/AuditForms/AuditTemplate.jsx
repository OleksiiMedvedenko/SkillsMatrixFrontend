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

const closeTab = () => {
	// Close the tab after 5 seconds
	setTimeout(() => {
	  window.close();
	}, 5000);
  };

const getCurrentFormatedDate = () => {
	const currentDate = new Date();
	const day = String(currentDate.getDate()).padStart(2, '0');
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const year = currentDate.getFullYear();
	const formattedDate = `${day}.${month}.${year}`;
	return formattedDate;
}

function getCurrentDateNetFormat() {
	// Create a Date object
	const d = new Date();

	// Extract date components
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const day = String(d.getDate()).padStart(2, '0');
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	const seconds = String(d.getSeconds()).padStart(2, '0');

	// Format the date as 'MM/DD/YYYY HH:mm:ss'
	const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

	return formattedDate;
}

function formatNetDateFromString(inputDate) {
	const dateParts = inputDate.split('-');
	const day = parseInt(dateParts[0]);
	const month = parseInt(dateParts[1]);
	const year = parseInt(dateParts[2]);
  
	// Create a Date object using the parsed components
	const date = new Date(year, month - 1, day);
  
	// Format the date into "MM/DD/YYYY HH:mm:ss js" format
	const options = {
	  year: 'numeric',
	  month: '2-digit',
	  day: '2-digit',
	  hour: '2-digit',
	  minute: '2-digit',
	  second: '2-digit',
	  hour12: true, // Use AM/PM format
	};
  
	const formattedDate = date.toLocaleString('en-US', options);

	return formattedDate;
}

const AuditTemplate = () => {
	const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
	const auditDocumentData = JSON.parse(localStorage.getItem('auditDocumentData'));

	const [sumValues, setSumValues] = React.useState(0);
	const [template, setTemplate] = React.useState([]);

	const [line, setLine] = React.useState();
	const [auditStatus, setAuditStatus] = React.useState('Audyt niezaliczony');

	const { data: saveAuditDocumentResult, postDataWithReturnValue: postData} = usePost();
	const { data: QuestionsData, error: postError, postData: postQuestionData} = usePost();

	const { data: updateCompetenceResult, postDataWithReturnValue: updateCompetencePost} = usePost();

	const { data: auditedEmployee, error: employeeError } = useFetch(REACT_APP_API_URL + "employee/getEmployee/" + auditDocumentData?.auditedEmployeeId);
	const { data: templateData, loading: templateLoading, error: templateError } = useFetch(REACT_APP_API_URL + "Form/getTemplate/" + auditDocumentData?.auditId);
	const {data: header} = useFetch(REACT_APP_API_URL + "Form/getHeader/" + template[0]?.TemplateForm?.TemplateId);

	const minPoints = template.reduce((accumulator, currentItem) => {
		return accumulator + currentItem?.TemplateForm?.Question?.MinValue;
	}, 0);

	console.log(auditDocumentData)
	
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

	useEffect(() => {
	  if (template !== null && template?.length > 0) {
		const newSum = template?.reduce((sum, obj) => sum + (parseInt(obj?.Value) || 0), 0);
		setSumValues(newSum);

		let newAuditStatus = 'Audyt niezaliczony'; // Default status

		if (newSum >= minPoints) {
			if(newSum >= header?.Division)
			{
				newAuditStatus = 'Audyt zaliczony na poziom 2';
			}
			else{
				newAuditStatus = 'Audyt zaliczony na poziom 1';
			}
		}

    	setAuditStatus(newAuditStatus);
	  }
	}, [template]);

	if (templateError.length > 0 || employeeError.length > 0) {
	    return <Error err={templateError +  '|' + employeeError.length} />;
	}
	if (templateLoading) {return <Loading />;}

	const handleValueChange = (index, newValue) => {
		const updatedTemplate = [...template];
		updatedTemplate[index] = { ...updatedTemplate[index], Value: newValue };
		setTemplate(updatedTemplate);
	};

	const handleCommentChange = (index, newComment) => {
		const updatedTemplate = [...template];
		updatedTemplate[index] = { ...updatedTemplate[index], Comment: newComment };
		setTemplate(updatedTemplate);
	};

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
			<input className="input-centered"
				type="text"
				style={{ width: '60%', height: '100%', border: 'none', fontSize: '18px', textAlign: 'center' }}
				value={item?.Value}
				maxLength="1"
				onChange={(e) => handleValueChange(index, e.target.value)}/>
			</td> 
			<td className="comment-cell" colSpan="26">
				<textarea
					style={{ width: '100%', height: '100%', border: 'none', resize: 'none', fontSize: '18px' }}
					value={template[index]?.Comment || null}
					onChange={(e) => handleCommentChange(index, e.target.value)}>
				</textarea>
			</td>
		  </tr>
		);
	});

	const handleFormSubmit = async () => {
		const result = window.confirm('Czy na pewno chcesz zapisać ten formularz?');
		if (result) {
			// update competence data
			let newLevel = 0;

			if (sumValues >= minPoints) {
				if(sumValues >= header?.Division)
				{
					newLevel = 2;
				}
				else{
					newLevel = 1;
				}
			}
			const updateCompetence = {
				AuditId: auditDocumentData?.auditId,
				EmployeeId: auditDocumentData?.auditedEmployeeId,					
				LastDate: auditDocumentData?.date === undefined ? getCurrentDateNetFormat() : formatNetDateFromString(auditDocumentData?.date),
				CurrentDate: getCurrentDateNetFormat(),
				LastLevel: auditDocumentData?.level === undefined ? newLevel : auditDocumentData?.level,
				CurrentLevel: newLevel
			}  
			const historyID = await updateCompetencePost(REACT_APP_API_URL +  'audit/updateAuditInfo', updateCompetence);
			
			const auditDocument = {
				AuditHistoryId: historyID,
				AuditTemplateId: template[0].TemplateForm?.TemplateId,
				AuditorId: loggedInUser?.id,
				Line: line,
			}

			const newAuditDocumentId = await postData(REACT_APP_API_URL + 'AuditData/createDocument', auditDocument);
			
			if(newAuditDocumentId !== null)
			{
				const data = [];
	  
				for (const question of template) {
				  const model = {
					AuditDocumentId: newAuditDocumentId,
					QuestionId: question?.TemplateForm?.Question?.QuestionId,
					Value: question.Value ?? 0,
					Comment: question.Comment,
				  };
		
				  data.push(model);
				}
				
				postQuestionData(REACT_APP_API_URL + 'AuditData/saveAuditResult', data).then(() => {
					// Once the data is updated successfully, update the competence
				  });;;
				
				closeTab();
			}
		}
	}


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
							<nobr>{loggedInUser?.Department?.Name}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="2">
							<nobr>Data:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="3">
							<nobr>{getCurrentFormatedDate()}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="4">
							<nobr>Audytor:</nobr>
					</td>
					<td className="info-table-cell-empty-style" colSpan="7">
							<nobr>{loggedInUser?.Employee?.FullName}</nobr>
					</td>
					<td className="info-table-cell-audit-status" colSpan="12" style={{ textAlign: "center" }} rowSpan="2">
							<nobr>{auditStatus}</nobr>
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
							<nobr>{auditedEmployee?.Position?.Name}</nobr>
					</td>
					<td className="info-table-cell-header-style" colSpan="2">
							<nobr>Linia:</nobr>
					</td>
					<td className="info-table-cell-header-bold-style" colSpan="3">
						<input type="text"
								className="input-centered"
								style={{ background: '#ececec', borderRadius: '3px', width: '60%', height: '100%', border: 'none', fontSize: '18px', textAlign: 'center' }}
								onChange={(e) => { setLine(e?.target?.value) }}/>
					</td>
					<td className="info-table-cell-header-style" colSpan="4">
							<nobr>Audytowany:</nobr>
					</td>
					<td className="info-table-cell-empty-style" colSpan="7">
							<nobr>{auditedEmployee?.Employee?.FullName}</nobr>
					</td>
					<td className="info-table-cell-audit-status" bgcolor="#f23d3d" colSpan="6" rowSpan="1">
							<nobr>{sumValues}</nobr>
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

{/* <!-- start accept button  --> */}
				<button className="accept-button" onClick={handleFormSubmit}>
					Zapisz 
				</button>
{/* <!-- end accept button  --> */}

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
					<Alerts severity="warning" message="Formularz dla tego audytu nie istnieje. Formularz możesz utworzyć w Ustawieniach albo a stronie (Formularz Auduty)" />
				)}
              	{postError !== null ? <Alerts severity="error" message="Szablon NIE został utworzony!"/> : null}   
				{QuestionsData !== null ? 
										(QuestionsData ? ( 	<Stack sx={{ width: '100%' }} spacing={2}>
																<Alerts severity="info" message="Okno zostanie automatycznie zamknięte za 5 sekund"/>
																<Alerts severity="success" message="Szablon został utworzony!"/> 
															</Stack>
														)  
													   : <Alerts severity="error" message="Szablon NIE został utworzony!"/> ) 
										: (null)}
			</tbody>
		</table>
    );
}

export default AuditTemplate;