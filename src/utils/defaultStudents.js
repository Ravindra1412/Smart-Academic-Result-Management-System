import { genAtt } from './attendance';

const DEFAULT_STUDENTS = [
  { id:1, roll:'STU001', name:'Priya Sharma',    cls:'10-A', dob:'2003', gender:'Female', cat:'General', email:'priya@edu.com',   phone:'9876543210', marks:{Mathematics:88,Science:92,English:78,SocialStudies:85,Hindi:90,ComputerScience:95}, att:genAtt(.92) },
  { id:2, roll:'STU002', name:'Arjun Kumar',     cls:'10-B', dob:'2004', gender:'Male',   cat:'OBC',     email:'arjun@edu.com',   phone:'9876543211', marks:{Mathematics:74,Science:68,English:82,SocialStudies:79,Hindi:71,ComputerScience:88}, att:genAtt(.85) },
  { id:3, roll:'STU003', name:'Divya Lakshmi',   cls:'10-A', dob:'2002', gender:'Female', cat:'SC',      email:'divya@edu.com',   phone:'9876543212', marks:{Mathematics:55,Science:60,English:72,SocialStudies:65,Hindi:80,ComputerScience:58}, att:genAtt(.78) },
  { id:4, roll:'STU004', name:'Karthik Rajan',   cls:'10-C', dob:'2003', gender:'Male',   cat:'General', email:'karthik@edu.com', phone:'9876543213', marks:{Mathematics:91,Science:87,English:84,SocialStudies:88,Hindi:76,ComputerScience:93}, att:genAtt(.97) },
  { id:5, roll:'STU005', name:'Sneha Patel',     cls:'10-B', dob:'2004', gender:'Female', cat:'OBC',     email:'sneha@edu.com',   phone:'9876543214', marks:{Mathematics:42,Science:38,English:55,SocialStudies:48,Hindi:62,ComputerScience:44}, att:genAtt(.71) },
  { id:6, roll:'STU006', name:'Rahul Verma',     cls:'10-C', dob:'2003', gender:'Male',   cat:'General', email:'rahul@edu.com',   phone:'9876543215', marks:{Mathematics:67,Science:73,English:69,SocialStudies:71,Hindi:65,ComputerScience:78}, att:genAtt(.88) },
  { id:7, roll:'STU007', name:'Anitha Ravi',     cls:'10-A', dob:'2004', gender:'Female', cat:'ST',      email:'anitha@edu.com',  phone:'9876543216', marks:{Mathematics:83,Science:79,English:88,SocialStudies:90,Hindi:85,ComputerScience:82}, att:genAtt(.94) },
];


export { DEFAULT_STUDENTS };
