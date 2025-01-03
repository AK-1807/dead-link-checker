"use client"
import { useState } from "react";
import { Fragment } from 'react';




const proxyUrl = "https://cors-anywhere.herokuapp.com/";
export default function Home() {
  const [url, setUrl] = useState("")

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');

  const [links, setLinks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult([]);

    if (!url) {
        alert("please enter URL");
        return;
    }

    try {
      const response = await fetch('/api/check-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      console.log(object)
     
      const data = await response.json();
      if(data){
        setLoading(false)
      }
      console.log(data)
      setLinks(data)
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.linkStatus);
      }
    } catch (err) {
      setError('An error occurred while checking the links.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="py-[60px]">
      <div className="container px-[20px] w-full max-w-[1244px] mx-auto">
        <h3>Site Checker: Free Broken Link Tool</h3>
        <div className="mt-[30px] w-full">
          
          <input className="h-[60px] w-full border-2 border-indigo-600 p-[10px] rounded-[8px]" type="url" placeholder="Enter URL" onInput={(e)=>setUrl(e.target.value)} required/>
        </div>
        <div className="text-center mt-[30px]">
          <button className="px-[15px] rounded-[8px] py-[5px] bg-indigo-600 text-white" onClick={handleSubmit}>
            Check
          </button>
        </div>
        
        <div className="flex flex-wrap">
          {console.log(links)}
          {links.linkStatus.length && links?.linkStatus?.map((link,index)=>{
            return (<Fragment key={index}>
              <div className="w-[60%] p-[10px]">
                {link.link}
                </div>
                <div className="w-[40%] p-[10px]">
                    {link.status}
                </div>
            </Fragment>)
          })}
          
        </div>
       
      </div>
    </section>
  );
}





