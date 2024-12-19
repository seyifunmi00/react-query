//https://jsonplaceholder.typicode.com/todos

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import './App.css'

function App() {

 const queryClient = useQueryClient()

// const {data, error, isLoading} = useQuery({queryKey: ['todos'], queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos').then(res => res.json())})

  const {data, error, isLoading} = useQuery({queryKey: ['posts'], queryFn: () => fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
  // staleTime: 60000
   refetchInterval :60000,
  })

  const { mutate, isPending, isError} = useMutation( {mutationFn: (newPosts)=> fetch('https://jsonplaceholder.typicode.com/posts', {method: 'POST',   headers: {
     'Content-Type': 'application/json; charset=utf-8'  // This tells the server that we're sending JSON data
    }, body: JSON.stringify(newPosts)}).then(res => res.json()),
  onSuccess: (newPosts) => {
   // queryClient.invalidateQueries({queryKey: ['posts']})
   queryClient.setQueryData(['posts'], (oldData) => [...oldData, newPosts])
  }} )


  if(error || isError) return <div>There was an error {error.message}</div>

  if(isLoading) return <div>Loading...</div>


  return (
    <>
    {isPending && <p>data is being added....</p>}
      <button onClick={() => mutate({
        "userId": 4000,
        "id": 7000,
        "title": "Hello",
        "body": "Hello World"
      })}>
        Add Posts
      </button>
     {data && data.map(item => (
       <div key={item.id}>
         <h4>{item.id}</h4>
         <h2>{item.title}</h2>
        <p>{item.body}</p>
       </div>

     ))}
    </>
  )
}

export default App


//install @tanstack/react-query
//Wrap your entire app with the
//<QueryClientProvider client={queryClient}>
//</QueryClientProvider> in the main.jsx
//import the use Query hook
//the useQuery accepts two inputs the queryKey and the queryFn
//you can get the data, error, isLoading, isError from the function
//To add data to the API you will use the useMutation
//We get back a mutate data from the post request which we will use in our onClick handler
//you can get mutation, isPending, isError, isSuccess from the post requests
//the onSuccess means when the post request is done the .invalidateQueries() means to fetch the data once again when the post request is already done
//the .setQueryData() means to update the data in the cache this does not add it to the api itself
 //staleTime is the time after which the data will be refetched but it has to be triggered
//refechTime is the time after which the data will be refetched but it does this automatically
