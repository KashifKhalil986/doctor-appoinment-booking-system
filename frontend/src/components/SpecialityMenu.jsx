import { Link } from "react-router-dom"
import { specialityData } from "../assets/assets"
const SpecialityMenu = () => {
  return (
    <>
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="speciality">
        <h3 className="text-3xl font-medium">Find by Speciality</h3>
        <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
    
    <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-auto">
{specialityData.map((item,index)=>(
<Link key={index} to={`/doctors/${item.speciality.replace(/\s+/g, '-').toLowerCase()}`} onClick={()=>window.scrollTo(0,0)} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" >
<img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
<p>{item.speciality}</p>
</Link>
))}
    </div>
    </div>
      
    </>
  )
}

export default SpecialityMenu
