import axios from "axios"
export async function GET(request) {
    // const { searchParams } = new URL(request.url)
    // const id = searchParams.get('id')
    const res = await axios.get("https://jsonplaceholder.typicode.com/users", {
      
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const users = await res.text();
   
    return Response.json({ users })
  }