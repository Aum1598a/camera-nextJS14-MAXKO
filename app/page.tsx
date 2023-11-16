'use client'
import Image from 'next/image'
import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react'
import { Camera } from './component/camera';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {

  const [textUrl, setText] = useState([])

  return (
    <div>
      <Camera onValueCamera={setText} />
      {textUrl.length ? textUrl.map((row: { id: number, img: string }) => {
        return (
          <div key={row.id} className='relative'>
            <Image
              width={128}
              height={128}
              src={row.img}
              alt="Picture of the author"
            />
            <div className='flex justify-center'>

            </div>
          </div>
        )
      }) : <span className='w-32 h-32 border rounded border-dashed flex justify-center items-center'> <ImagePlus className='h-16 w-16' color='gray' strokeWidth={1} /></span>}

      <Link href='/FaceRotationChecker'>
      <Button>
        Rotation Checker
      </Button>
    </Link>
    </div>
  )
}
