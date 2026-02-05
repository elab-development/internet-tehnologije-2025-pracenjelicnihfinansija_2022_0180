function Section({ title, subtitle, children }) {
  return (
    <section className='mb-10'>
      <div className='mb-4'>
        <h2 className='text-2xl font-bold text-green-800'>{title}</h2>
        {subtitle ? <p className='text-green-800/80 mt-1'>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default Section;