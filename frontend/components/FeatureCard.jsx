function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className='bg-white border border-green-200 rounded-xl shadow-sm p-5 hover:shadow transition'>
      <div className='flex items-start gap-3'>
        <div className='shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center'>
          <Icon className='text-green-700' size={20} />
        </div>
        <div>
          <h3 className='text-lg font-semibold text-green-900'>{title}</h3>
          <p className='text-green-900/80 mt-1 leading-relaxed'>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;