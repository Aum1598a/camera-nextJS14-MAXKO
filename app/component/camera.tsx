import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Aperture, ImagePlus, Plus, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Paint } from './paint';


export const Camera = ({ onValueCamera }: any) => {
  const [open, setOpen] = React.useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [screenshotArr, setScreenshotArr] = useState<{ id: number, img: string }[]>([]);


  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setScreenshot(screenshot);
    }
  };

  const hendelOpenDialog = () => {
    setOpen(true);
    setIsCameraOn(true);
  }

  const hendelDeleteImg = (idimg: string | null) => {
    if (idimg !== null) {
      let deleteImg = screenshotArr.filter((item: { id: number; img: string }) => item.id !== +idimg);
      let result = deleteImg.map((item: { id: number; img: string }, index: number) => ({
        ...item,
        id: index + 1,
      }));
      setScreenshotArr(result);
    } else {
      console.log("idimg is null");
    }
  }


  const hendelUrlImg = (url: string) => {
    if (url) {
      setScreenshot(null);
      setScreenshotArr([...screenshotArr, { id: screenshotArr.length + 1, img: url }])
    } else {
      setScreenshot(null);
    }

  }

  const hendelUpload = () => {
    onValueCamera(screenshotArr);
    setOpen(false);
  }
  const videoConstraints = {
    facingMode: "environment", // This should use the rear camera if available
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={hendelOpenDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='max-w-full h-screen  max-h-screen'>
          {screenshot ? (
            <div className='flex justify-center items-center'>
              <Paint imgSrc={screenshot} onValuePaint={hendelUrlImg} />
            </div>
          ) : isCameraOn ? (
            <>
              <div className='flex justify-center items-center'>
                <Webcam
                  ref={webcamRef}
                  height={500}
                  videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg"
                  width={500}
                />
              </div>
              <div>
                <div className='flex justify-center space-x-4 mt-4'>
                  {screenshotArr.length ? screenshotArr.map((row: { id: number, img: string }) => {
                    return (
                      <div key={row.id} className='relative'>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='absolute -top-5'
                          style={{ left: 108 }}
                          data-value={row.id}
                          onClick={(e) => hendelDeleteImg(e.currentTarget.getAttribute('data-value'))}
                        >
                          <XCircle size={24} />
                        </Button>
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
                </div>
                <div className='flex justify-center items-end  mt-12'>
                  <Button
                    size='icon'
                    variant='ghost'
                    type='button'
                    onClick={handleCapture}
                  >
                    <Aperture className='w-20 h-20' />
                  </Button>
                </div>

                <AlertDialogFooter className='items-end'>
                  <Button onClick={() => setOpen(false)} type="button">Cancel</Button>
                  <Button onClick={() => hendelUpload()} type="button">uplode</Button>
                </AlertDialogFooter>
              </div>
            </>
          ) : (
            <p >Camera is turned off</p>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}


// {isCameraOn ? (
//     <div className=''>
//         <Webcam
//             ref={webcamRef}
//             height={'100%'}
//             screenshotFormat="image/jpeg"
//             width={'100%'}
//         />
//     </div>
// ) : (
//     <p >Camera is turned off</p>
// )}
// <div>

//     <div >
//         {screenshot &&
//             <Image src={screenshot} alt="" height={200} width={200} />
//         }
//     </div>

// </div>
