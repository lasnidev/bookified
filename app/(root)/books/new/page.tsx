import UploadForm from '@/components/UploadForm'

const Page = () => {
  return (
    <main className="">
      <div className="wrapper">
        <section className="flex flex-col gap-5">
          <h1 className="page-title-xl">Add a New Book</h1>
          <p className="subtitle">Upload a PDF to generate your interactive interview</p>
        </section>
        <UploadForm />
      </div>
    </main>
  )
}

export default Page
