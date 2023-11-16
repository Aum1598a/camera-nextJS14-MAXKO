'use client'
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import ImageNext from 'next/image';
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
  const [screenshot, setScreenshot] = useState<string | null | unknown>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [screenshotArr, setScreenshotArr] = useState<{ id: number, img: string, size: number }[]>([]);
  const [orientation, setOrientation] = useState<number>(0);

  const handleCapture = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      const resizedData = await resizeImage(screenshot as string);
      setScreenshot(resizedData);
    }
  };


  const handleOrientationChange = () => {
    setOrientation((window.screen as any).orientation?.angle || 0);
  };

  useEffect(() => {
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);


  const resizeImage = (base64Image: string) => {
    let maxWidth = 512;
    let maxHeight = 512;
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedBase64 = canvas.toDataURL('image/jpeg');
          resolve(resizedBase64);
        } else {
          console.error("Could not get 2D context from canvas");
          resolve(base64Image);
        }
      };
    });
  };

  const hendelOpenDialog = () => {
    setOpen(true);
    setIsCameraOn(true);
  }

  const hendelDeleteImg = (idimg: string | null) => {
    if (idimg !== null) {
      let deleteImg = screenshotArr.filter((item: { id: number; img: string, size: number }) => item.id !== +idimg);
      let result = deleteImg.map((item: { id: number; img: string, size: number }, index: number) => ({
        ...item,
        id: index + 1,
      }));
      setScreenshotArr(result);
    } else {
      console.log("idimg is null");
    }
  }


  const hendelUrlImg = (url: string) => {
    let sizes: number | undefined = 0; // Initialize sizes to 0 or undefined

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        sizes = blob.size;
        if (url) {
          setScreenshot(null);
          setScreenshotArr([...screenshotArr, { id: screenshotArr.length + 1, img: url, size: sizes }]);
        } else {
          setScreenshot(null);
        }
      });

    // Do not use 'sizes' here as it may not be assigned yet
  };

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
        <AlertDialogContent className='max-w-full h-screen max-h-screen p-0'>
          {screenshot ? (
            <div className='flex justify-center items-center'>
              <Paint imgSrc={screenshot} onValuePaint={hendelUrlImg} />
            </div>
          ) : isCameraOn ? (
            <div className='relative'>
              <div className='flex justify-center items-center'>
                <Webcam
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
                  height={'100%'}
                  screenshotFormat="image/jpeg"
                  width={'100%'}
                />
              </div>

              {orientation === 0 &&
                <div className={`absolute inset-x-0 bottom-0 bg-white p-4`}
                  style={{ backgroundColor: '#ffffff11' }}

                >
                  <div className='flex justify-center space-x-4 mt-4'>
                    {screenshotArr.length ? screenshotArr.map((row: { id: number, img: string, size: number }) => {
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
                          <ImageNext
                            width={128}
                            height={128}
                            src={row.img}
                            alt="Picture of the author"
                          />
                          <p>{row.size}</p>
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
                    <Button onClick={() => setOpen(false)} type="button" className=' bg-red-500'>Cancel</Button>
                    <Button onClick={() => hendelUpload()} type="button" className=' bg-blue-500'>uplode</Button>
                  </AlertDialogFooter>
                </div>}
              {orientation === 90 &&
                <div className={`absolute inset-y-0 right-0 flex bg-white p-4`}
                  style={{ backgroundColor: '#ffffff11' }}
                >
                  <div className='inline-flex justify-center space-x-4 items-center'>
                    <div className='space-y-4'>
                      {screenshotArr.length ? screenshotArr.map((row: { id: number, img: string }) => {
                        return (
                          <div key={row.id} className='relative'>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='absolute -top-5 -left-5'
                              // style={{ left: 108 }}
                              data-value={row.id}
                              onClick={(e) => hendelDeleteImg(e.currentTarget.getAttribute('data-value'))}
                            >
                              <XCircle size={24} />
                            </Button>
                            <ImageNext
                              width={128}
                              height={128}
                              src={row.img}
                              alt="Picture of the author"
                            />
                          </div>
                        )
                      }) : <span className='w-32 h-32 border rounded border-dashed flex justify-center items-center'> <ImagePlus className='h-16 w-16' color='gray' strokeWidth={1} /></span>}
                    </div>
                  </div>
                  <div className='flex justify-center ml-12 items-center'>
                    <Button
                      size='icon'
                      variant='ghost'
                      type='button'
                      onClick={handleCapture}
                    >
                      <Aperture className='w-20 h-20' />
                    </Button>
                  </div>

                  <div className='flex items-end '>
                    <div className='space-y-4'>
                      <div>
                        <Button onClick={() => hendelUpload()} type="button" className=' bg-blue-500'>Upload</Button>
                      </div>
                      <div>
                        <Button onClick={() => setOpen(false)} type="button" className='bg-red-500'>Cancel</Button>
                      </div>

                    </div>
                  </div>
                  {/* <AlertDialogFooter className='items-end'>
                   
                  </AlertDialogFooter> */}
                </div>}
            </div>
          ) : (
            <p >Camera is turned off</p>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

