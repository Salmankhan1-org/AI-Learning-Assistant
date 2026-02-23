import React from 'react'
import { useDocument } from '../helper/DocumentContext'
import { getInlineUrl } from '../helper/getInlineUrl';

const CardContent = () => {
    const document = useDocument();


  return (
    <div className='w-full h-full'>
        <div className="w-full h-full">
            <embed
                src={document?.file?.url}
                type='application/pdf'
                title='Document Viewer'
                className='w-full h-full border-none'
                />
         </div>
    </div>
  )
}

export default CardContent