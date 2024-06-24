import axios from "axios"
export async function GET(request) {
    // const { searchParams } = new URL(request.url)
    // const id = searchParams.get('id')
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const users = await res.json();
   
    return Response.json({ users })
  }