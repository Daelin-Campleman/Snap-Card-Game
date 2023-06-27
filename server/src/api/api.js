import {config} from '../../config/config.js';

export async function postHistory(game) {
    const response = await fetch(`${process.env.API_URL}/gameResults`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(game)
      })
      
    return response.json()
}

export async function getHistory(token) {
    const response = await fetch(`${process.env.API_URL}/${token}`,{
        method: 'GET',
      })
      
    return response.json()
}

export async function getInfo(token) {
  const response = await fetch(`${process.env.API_URL}/${token}`,{
      method: 'GET',
    })
    
  return response.json()
}

export async function sendInfo(token) {
  const response = await fetch(`${process.env.API_URL}/${token}`,{
      method: 'GET',
    })
    
  return response.json()
}
