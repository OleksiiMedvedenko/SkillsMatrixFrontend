import AuditTemplate from "../../components/AuditForms/AuditTemplate";
import AuditCompletedForm from "../../components/AuditForms/AuditCompletedForm";
import { useLocation } from 'react-router-dom';

const AuditForm = () => {
	const location = useLocation();
	const isTemplate = location.pathname === '/audit-form/template';
	 
	return isTemplate ? <AuditTemplate /> : <AuditCompletedForm/>
}

export default AuditForm;
