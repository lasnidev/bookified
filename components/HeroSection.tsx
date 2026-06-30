import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const steps = [
  {
    title: 'Upload PDF',
    description: 'Add your book file',
  },
  {
    title: 'AI Processing',
    description: 'We analyze the content',
  },
  {
    title: 'Voice Chat',
    description: 'Discuss with AI',
  },
]

const HeroSection = () => {
  return (
    <section className='library-hero-card mb-6 md:mb-10' aria-labelledby='library-heading '>
        <div className='library-hero-content'>
          <div className='library-hero-text'>
            <h1 id='library-heading' className='library-hero-title'>
              Your Library
            </h1>
            <p className='library-hero-description'> 
              Convert your books into interactive AI conversations. Listen,
              learn, and discuss your favorite reads.
            </p>
            <Link href='/books/new' className='library-cta-primary'>
              <Plus className='size-6' strokeWidth={2.25} aria-hidden='true' />
              Add new book
            </Link>
          </div>

          <div className='library-hero-illustration-desktop'>
            <Image
              src='/assets/hero-illustration.png'
              alt='Vintage books, an open book, a globe, and a reading lamp'
              width={491}
              height={352}
              priority
              className='library-hero-image'
            />
          </div>

          <div className='library-steps-card' aria-label='How it works'>
            {steps.map(({ title, description }, index) => (
              <div className='library-step-item' key={title}>
                <span className='library-step-number'>{index + 1}</span>
                <div className='library-step-copy'>
                  <h2 className='library-step-title'>{title}</h2>
                  <p className='library-step-description'>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default HeroSection