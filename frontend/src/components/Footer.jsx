import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <>
    <div className="md:mx-10">
<div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
    {/* left */}
    <div className="">

        <img className="mb-5 w-40" src={assets.logo} alt="" />
<p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type it to make a type specimen book.</p>
    </div>

    {/* center */}
    <div className="">
        <p className="text-xl mb-5 font-medium">COMPANY</p>
        <ul className="flex flex-col gap-2 text-gray-600">
            <li className="">Home</li>
            <li className="">About Us</li>
            <li className="">Contact Us</li>
            <li className="">Privacy & Policy</li>
        </ul>
    </div>

    {/* right */}
    <div className="">
        <p className="text-xl mb-5 font-medium">GET IN TOUCH</p>
        <ul className="flex flex-col gap-2 text-gray-600">
            <li className="">+92 3495262735</li>
            <li className="">kashifkhalil720@gmail.com</li>
         
        </ul>
    </div>
</div>
{/* copyright text  */}
<div className="">
    <hr />
    <h1 className="py-5 text-center text-sm">Copyright ©2025 - All Right Reserved.</h1>
</div>
    </div>
      
    </>
  )
}

export default Footer
