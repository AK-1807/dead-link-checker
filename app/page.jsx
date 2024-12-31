"use client"
import { useState } from "react";



export default function Home() {
  const [url, setUrl] = useState("")


  async function getLinksFromWebsite() {
    console.log(url)

     try {
    
    const response = await fetch(`/api/get-links?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      const errorText = await response.text(); 
      console.error('Error fetching links:', errorText); 
      return;
    }

    const data = await response.json();
    
    if (data.links) {
      console.log(data.links); // Array of links
    } else {
      console.error('No links found in response');
    }
  } catch (error) {
    console.error('Error fetching links:', error);
  }
  }

  return (
    <section className="py-[60px]">
      <div className="container px-[20px] w-full max-w-[1244px] mx-auto">
        <h3>Site Checker: Free Broken Link Tool</h3>
        <div className="mt-[30px] w-full">
          
          <input className="h-[60px] w-full border-2 border-indigo-600 p-[10px] rounded-[8px]" type="url" placeholder="Enter URL" onInput={(e)=>setUrl(e.target.value)} required/>
        </div>
        {/* <div className="mt-[20px] mr-[20px] inline-block">
          <input id="all" className="" type="radio" placeholder="Enter URL"/>
          <label htmlFor="all">Check whole website</label>
        </div>
        <div className="mt-[20px] inline-block">
          <input id="single" className="" type="radio" placeholder="Enter URL"/>
          <label htmlFor="single">Check single webpage</label>
        </div> */}
        <div className="text-center mt-[30px]">
          <button className="px-[15px] rounded-[8px] py-[5px] bg-indigo-600 text-white" onClick={getLinksFromWebsite}>
            Check
          </button>
        </div>
       
      </div>
    </section>
  );
}





// Example usage
// getLinksFromWebsite('https://example.com');
