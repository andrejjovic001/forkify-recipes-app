import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};



// Kada stavimo jedan od parametara undefined znaci da mozemo pozvati funkciju samo sa jednim parametrom a drugi ne znaci nista
export const AJAX = async function(url, uploadData = undefined) {
  try {
      const fetchPro = uploadData ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      }) : fetch(url);
    
      // Desava se trka izmedju fetch i timeout, npr. ako je spor interent i fetch se ne izvrsi brzo dobicemo gresku iz timeout funkcije
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();
    
      if (!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  }catch (err) {
    throw err;  // Ovako pisemo da bi se ova greska ispisivala iz model.js fajla jer je ovo funkcija
}  

};


/*
export const getJSON = async function(url) {
    try {
        // Desava se trka izmedju fetch i timeout, npr. ako je spor interent i fetch se ne izvrsi brzo dobicemo gresku iz timeout funkcije
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;

    }catch (err) {
        throw err;  // Ovako pisemo da bi se ova greska ispisivala iz model.js fajla jer je ovo funkcija
    }  
};



export const sendJSON = async function(url, uploadData) {
  try {
      const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      })
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();

      if (!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;

  }catch (err) {
      throw err;  // Ovako pisemo da bi se ova greska ispisivala iz model.js fajla jer je ovo funkcija
  }  
};
*/