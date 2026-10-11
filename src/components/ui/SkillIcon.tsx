import type {Skill} from '@/lib/data';
import TechLogo from './TechLogo';
const PATHS:Record<string,string>={
 'Product Strategy':'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z M12 10v4 M10 12h4',
 'Go-to-Market Strategy':'M3 10v5h5l10 5V5L8 10H3Z M8 15l2 6H6l-2-6 M21 9v7',
 'Roadmapping':'M5 4v12a4 4 0 0 0 8 0V8a4 4 0 0 1 8 0v12 M2 7l3-3 3 3 M18 17l3 3 2-3',
 'Requirements Gathering':'M8 5H5v16h14V5h-3 M8 3h8v4H8Z M8 11l1 1 2-2 M13 11h3 M8 16l1 1 2-2 M13 16h3',
 'Business Case Development':'M8 7V4h8v3 M3 8h18v13H3Z M3 12l9 4 9-4 M10 13h4v4h-4Z',
 'Structured Problem-Solving':'M3 3h7v4c4-3 7 2 3 4h8v10h-8v-4c-4 3-7-2-3-4H3Z',
 'Agile (Scrum/Kanban)':'M3 9a9 9 0 0 1 16-3l2 3 M21 3v6h-6 M21 15A9 9 0 0 1 5 18l-2-3 M3 21v-6h6',
 'Stakeholder Management':'M9 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0 M6 21v-4a6 6 0 0 1 12 0v4 M3 10a2 2 0 1 0 0 4 M21 10a2 2 0 1 1 0 4 M1 21v-3h3 M23 21v-3h-3',
 'SQL':'M4 6c0-4 16-4 16 0s-16 4-16 0Z M4 6v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0',
 'Power BI':'M4 11h4v10H4Z M10 6h4v15h-4Z M16 2h4v19h-4Z',
 'Tableau':'M12 2v20 M2 12h20 M5 5v5 M2.5 7.5h5 M19 5v5 M16.5 7.5h5 M5 16v5 M2.5 18.5h5 M19 16v5 M16.5 18.5h5',
 'Advanced Excel':'M8 3h13v18H8 M13 3v18 M8 9h13 M8 15h13 M2 7h9v11H2Z M4 10l5 5 M9 10l-5 5',
 'VBA':'M7 4H5v6l-3 2 3 2v6h2 M17 4h2v6l3 2-3 2v6h-2 M13 7l-3 10',
 'Time Series Forecasting':'M3 3v18h18 M5 16l4-5 4 2 4-6 4 2 M17 3h4v4',
 'Account Segmentation':'M12 12V2a10 10 0 1 0 10 10H12Z M15 2v7h7a8 8 0 0 0-7-7Z',
 'Cloud Architecture (AWS)':'M6 18a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12H6 M8 12h8 M12 9v6',
 'Data Governance / MDM':'M12 2 3 6v7c0 5 9 9 9 9s9-4 9-9V6Z M7 12l3 3 7-7',
 'Web Scraping':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M2 12h20 M12 2c-6 6-6 14 0 20 6-6 6-14 0-20',
 'Data Analysis':'M3 20h18 M5 15v2 M10 10v7 M15 12v5 M20 4v13 M3 9l6-5 6 3 5-5',
 'Machine Learning':'M12 5c-3-6-9-1-7 3-5 2-3 8 0 8-1 6 6 7 7 3V5Z M12 5c3-6 9-1 7 3 5 2 3 8 0 8 1 6-6 7-7 3 M5 8l3 2 M5 16l3-2 M19 8l-3 2 M19 16l-3-2',
 'RAG Pipelines':'M2 5l8-3 8 3-8 4-8-4Z M2 10l8 4 4-2 M2 15l8 4 M17 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M20 19l3 3',
 'Prompt Engineering':'M3 4h18v16H3Z M6 8l4 4-4 4 M13 16h5',
 'Google TimesFM':'M2 13c2 0 2-8 4-8s2 15 5 15 2-16 5-16 2 9 6 9',
 'Automations':'M14 2 4 14h7l-1 8 10-12h-7l1-8Z',
 'Salesforce':'M7 18a5 5 0 1 1-1-10 6 6 0 0 1 11-2 6 6 0 1 1 1 12H7Z',
 'CRM Management':'M2 4h20v16H2Z M5 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M4 17c0-5 6-5 6 0 M14 8h5 M14 12h5 M14 16h3',
 'Market & Competitive Research':'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z M16 16l6 6 M5 12l4-4 3 2 3-5',
 'Financial Modeling':'M3 3h18v18H3Z M3 8h18 M9 8v13 M6 18l4-4 3 2 5-5 M15 11h3v3',
 'ROI & NPV Analysis':'M6 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M18 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M5 21 19 3',
 'Budgeting':'M3 7h18v14H3V7l14-4v4 M16 12h6v5h-6Z M18.5 14.5h.01',
 'Variance Analysis':'M3 3v18h18 M7 14l3-4 3 3 5-6 M15 3h5 M17.5 .5v5 M15 19h5',
 'KPI Development':'M3 19a10 10 0 1 1 18 0H3Z M12 16l5-7 M5 13h2 M17 13h2 M12 5v2',
 'Financial Statement Analysis':'M5 2h10l5 5v15H5Z M15 2v6h5 M12 10v8 M14.5 11.5c-.5-1-4.5-1-4.5 1s4.5 1 4.5 3-4 2-4.5 1',
};
// Tools whose official marks aren't redistributable: simple glyphs in each brand's colours.
const BRANDISH:Record<string,React.ReactNode>={
 'Cloud Architecture (AWS)':<><text x="12" y="13" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="9.5" letterSpacing="-.3" fill="#232F3E">aws</text><path d="M4 16.2c4.8 3.2 11.2 3.2 16 0" fill="none" stroke="#FF9900" strokeWidth="1.9" strokeLinecap="round"/><path d="M17.2 15.1l3.1.9-.9 3" fill="none" stroke="#FF9900" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></>,
 'Power BI':<><rect x="4" y="11" width="4.6" height="10" rx="1.2" fill="#F8D650"/><rect x="9.7" y="7" width="4.6" height="14" rx="1.2" fill="#F2C811"/><rect x="15.4" y="3" width="4.6" height="18" rx="1.2" fill="#D5A600"/></>,
 'Advanced Excel':<><rect x="2.5" y="3" width="19" height="18" rx="3.5" fill="#1D7044"/><path d="M8 7.5l8 9M16 7.5l-8 9" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"/></>,
 'Tableau':<><path d="M12 6.5v11M6.5 12h11" stroke="#E8762D" strokeWidth="2.2" strokeLinecap="round"/><path d="M5 2.5v4M3 4.5h4M19 2.5v4M17 4.5h4M5 17.5v4M3 19.5h4M19 17.5v4M17 19.5h4" stroke="#1F447E" strokeWidth="1.6" strokeLinecap="round"/></>,
 'Salesforce':<path d="M7 18.5a4.6 4.6 0 0 1-.9-9.1 5.6 5.6 0 0 1 10.3-1.7 5.4 5.4 0 1 1 1.8 10.8Z" fill="#00A1E0"/>,
};
export default function SkillIcon({skill,size=24}:{skill:Skill;size?:number}){
 if(skill.logo)return <TechLogo logo={skill.logo} family={skill.family} size={size}/>;
 const brandish=BRANDISH[skill.name];
 if(brandish)return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{brandish}</svg>;
 return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={PATHS[skill.name]||PATHS['Product Strategy']} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
