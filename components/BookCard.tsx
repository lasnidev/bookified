import { BookCardProps } from '@/type'
import Image from 'next/image'

const BookCard = ({title, author, coverUrl}: BookCardProps) => {
  return (
    <article className='book-card'>
      <figure className='book-card-figure'>
        <div className="book-card-cover-wrapper">
          <Image src={coverUrl} alt={title} width={133} height={200} className='book-card-cover'/>
        </div>
      </figure>

      <figcaption className='book-card-meta'>
        <h3 className='book-card-title'>{title}</h3>
        <p className='book-card-author'>{author}</p>
      </figcaption>
    </article>
  )
}

export default BookCard
