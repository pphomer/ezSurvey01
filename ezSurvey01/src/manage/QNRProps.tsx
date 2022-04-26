import React from 'react'
import { ExamDateRange, Description, Title, BannerImg } from './components/props_elements'

export default function QNRProps() {


  return (
    <form id="qnrForm">
      <BannerImg />
      <section className="bg-light">
        <Title required />
        <ExamDateRange required />
        <Description />
      </section>
    </form>
  )
}
