import {z} from 'zod';
import bcrypt from 'bcryptjs';
import {ConnectDB} from '@/lib/DatabaseConnection';
import User from '@/models/User';
import {currentUser,setSession,clearSession,sameOrigin,readBody} from '@/lib/auth';
export const runtime='nodejs';
const schema=z.object({action:z.enum(['signup','signin']),name:z.string().trim().max(60).optional(),email:z.email().max(254).transform(v=>v.toLowerCase().trim()),password:z.string().min(8).max(72)});
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){try{return json({user:await currentUser()})}catch{return json({error:'সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না।'},503)}}
export async function POST(request){if(!sameOrigin(request))return json({error:'অনুমতি নেই।'},403);try{const parsed=schema.safeParse(await readBody(request));if(!parsed.success)return json({error:'সঠিক ইমেইল ও ৮–৭২ অক্ষরের পাসওয়ার্ড দিন।'},400);const {action,name,email,password}=parsed.data;await ConnectDB();let user;if(action==='signup'){user=await User.create({name,email,password:await bcrypt.hash(password,12)})}else{user=await User.findOne({email}).select('+password');if(!user||!await bcrypt.compare(password,user.password))return json({error:'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'},401)}await setSession(user._id);return json({user:{_id:String(user._id),name:user.name,email:user.email}})}catch(e){if(e.code===11000)return json({error:'এই ইমেইলে ইতিমধ্যে অ্যাকাউন্ট আছে।'},409);if(e instanceof SyntaxError||e.message==='PAYLOAD_TOO_LARGE')return json({error:'সঠিক তথ্য দিন।'},400);return json({error:'সার্ভার কনফিগারেশন বা ডাটাবেস সংযোগ পরীক্ষা করুন।'},503)}}
export async function DELETE(request){if(!sameOrigin(request))return json({error:'অনুমতি নেই।'},403);await clearSession();return json({success:true})}
