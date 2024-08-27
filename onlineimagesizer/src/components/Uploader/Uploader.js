import React,{useState,useEffect,useRef} from 'react'
import './Uploader.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDownload } from 'react-icons/fa';
import { FaUpload } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { useDropzone } from 'react-dropzone';



function Uploader() {
    const [image,setImage] = useState(null)
    const [fileName,setFileName] = useState('No selected file')
    const [Nwidth,setNwidth] = useState('')
    const [Nheight,setNheight] = useState('')
    const [isDisabled,setIsDisabled] = useState(false)
    const [isDownDisabled,setIsDownDisabled] = useState(false)
    const [isShaking, setIsShaking] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previousSize, setPreviousSize] = useState({width: 0, height: 0});
    const [newSize, setNewSize] = useState({width: 0, height: 0});
    const [activeToggle, setActiveToggle] = useState('dimensions');
    const [percent, setPercent] = useState('');

    const canvasRef = useRef(null); // Canvas referansı oluşturuldu

    // Resim yüklendiğinde canvas'a çizme işlemini gerçekleştiren useEffect
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;

            img.onload = () => {
            // Orijinal resim boyutları
            const originalWidth = img.width;
            const originalHeight = img.height;
            console.log(`Previous Size : ${originalWidth} x ${originalHeight}`);
            
            //orijiinal resim
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

            };
        }
    }
        
    }, [image]);

    const handleToggleChange = (value) => {
        setActiveToggle(value);
    };

    const handleWidthChange = (e) => {
        const newWidth = parseInt(e.target.value);
        setNwidth(newWidth);
    
        if (newWidth === 1) {
            setNheight(1);
        } else {
            const canvas = canvasRef.current;
            if (canvas && canvas.width > 0 && canvas.height > 0) {
                const aspectRatio = canvas.height / canvas.width;
                const newHeight = Math.floor(newWidth * aspectRatio);
                setNheight(newHeight);
            } else {
                setNheight(""); // Geçerli bir resim yoksa yüksekliği sıfırlayın
                toast.error('Canvas üzerinde geçerli bir resim yok.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };
    
    
    
    const handleHeightChange = (e) => {
        const newHeight = parseInt(e.target.value);
        setNheight(newHeight);
    
        if (newHeight === 1) {
            setNwidth(1);
        } else {
            const canvas = canvasRef.current;
            if (canvas && canvas.width > 0 && canvas.height > 0) {
                const aspectRatio = canvas.width / canvas.height;
                const newWidth = Math.floor(newHeight * aspectRatio);
                setNwidth(newWidth);
            } else {
                setNwidth(""); // Geçerli bir resim yoksa genişliği sıfırlayın
                toast.error('Canvas üzerinde geçerli bir resim yok.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };
    
    
    const bypercent = (value) => {
        setPercent(value);
        const canvas = canvasRef.current;
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            const newWidth = Math.floor(canvas.width * percent / 100);
            const newHeight = Math.floor(canvas.height * percent / 100);
            setNwidth(newWidth);
            setNheight(newHeight);
        } else {
            setNwidth(""); // Geçerli bir resim yoksa genişliği sıfırlayın
            setNheight(""); // Geçerli bir resim yoksa yüksekliği sıfırlayın
            toast.error('Canvas üzerinde geçerli bir resim yok.', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if(file){
            if(file.type.startsWith('image/')){
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target.result);
                    setFileName(file.name);
                    setIsDisabled(true);
                    setIsDownDisabled(true);

                    toast.success('Image uploaded successfully!', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                };
                reader.readAsDataURL(file);
            }else{
                toast.error('Invalid file type. Please select an image file.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setFileName('No selected file');
                setIsDisabled(false);
                setImage(null);
            }
        }
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});    


    const handleDelete = () => {
        if (image) {
            setIsShaking(true); // Sınıfı ekle

            setTimeout(() => {
            setIsShaking(false); // Sınıfı kaldır
        }, 500);

            setImage(null);
            setFileName('No selected file');
            setIsDisabled(false);
            setIsDownDisabled(false);
            previousSize.width = 0;
            previousSize.height = 0;
            newSize.width = 0;
            newSize.height = 0;
            

            // Canvas'ı temizlemek için
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                toast.warn('Image deleted successfully!', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else {
            setIsDisabled(true);
            toast.error('No file selected to delete', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const downloadImage = () => {
        if(activeToggle === 'percentage' && percent === ""|| activeToggle === 'dimensions' && Nwidth === "" || Nheight === ""){
            toast.error('Please enter value', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
        const canvas = canvasRef.current; 
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            setProgress(25);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${fileName}-resized.png`;

            setProgress(50);

            link.click();

            setProgress(100);

            toast.success('Image downloaded successfully!', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,}); 

                setTimeout(() => setProgress(0), 1500);
        } else{
            setIsDownDisabled(true);
            toast.error('No image available to download', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    };

    

    const resizeFunc = () => {
        if (image) {
            const canvas = canvasRef.current;
            if(canvas){
                const previousWidth = canvas.width;
                const previousHeight = canvas.height;

                // Yeni boyutları alın
                let width = parseInt(Nwidth);
                let height = parseInt(Nheight);

                if (activeToggle === 'percentage') {
                    if (percent === "" || isNaN(percent)) {
                        toast.error('Please enter a valid percentage value', {
                            position: 'bottom-right',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        return;
                    }
    
                    width = Math.floor(canvas.width * percent / 100);
                    height = Math.floor(canvas.height * percent / 100);
                }
    

                if (activeToggle === 'dimensions' && (Nwidth === "" || Nheight === "" || isNaN(width) || isNaN(height))){
                    toast.error('Please enter width and height values', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    return;
                }


                // Sınırları belirleyin
                const maxWidth = 20000;
                const maxHeight = 20000;


                if ( activeToggle === 'dimensions'  && width > maxWidth || height > maxHeight) {
                    toast.error('Width and Height values must be less than 20000', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    return;
                }
            
                setProgress(25);


                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = image;

                img.onload = () => {
                    setProgress(50); // Progress bar'ı %50'ye ayarla

                     // Canvas boyutlarını ayarla
                    canvas.width = width;
                    canvas.height = height;
            
                    // Resmi yeniden çiz
                    ctx.drawImage(img, 0, 0, width, height);

                    // State'leri güncelle
                    setPreviousSize({ width: previousWidth, height: previousHeight });
                    setNewSize({ width, height });

                    setProgress(100); // Progress bar'ı %100'e ayarla

                    toast.success('Image resized successfully!', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setTimeout(() => setProgress(0), 1500); // Progress bar'ı sıfırla

                };
                        
            }
                
        }
    }
        
        

    const resetFunc = (e) => {
        setNheight("");
        setNwidth("");
        e.preventDefault();
        previousSize.width = 0;
        previousSize.height = 0;
        newSize.width = 0;
        newSize.height = 0;
        setPercent("");
        

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
       
                toast.warn('Image reset successfully!', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    function ToggleButtonGroup({ onToggleChange,activeButton }) {
           const handleToggle = (value) => {
            if(value !== activeButton){
                onToggleChange(value);
            }
        };
    
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <button
                    className='button-dimensions'
                    onClick={() => handleToggle('dimensions')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '5px 0 0 5px',
                        border: '1px solid #ccc',
                        backgroundColor: activeButton === 'dimensions' ? '#111827' : '#030712',
                        opacity: activeButton === 'dimensions' ? '1' : '0.7',
                        color: activeButton === 'dimensions' ? '#fff' : '#ccc',
                        cursor: 'pointer',
                    }}
                >
                    By Dimensions
                </button>
                <button
                    onClick={() => handleToggle('percentage')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '0 5px 5px 0',
                        border: '1px solid #ccc',
                        backgroundColor: activeButton === 'percentage' ? '#111827' : '#030712',
                        opacity: activeButton === 'percentage' ? '1' : '0.7',
                        color: activeButton === 'percentage' ? '#fff' : '#ccc',
                        cursor: 'pointer'
                    }}
                >
                    As Percentage
                </button>
            </div>
        );
    }



  return (
    <main className="flex flex-col items-center">
        <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />        
        {image ?(
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ):(
        <>
            <FaUpload className='upload'  size={60}/>
            <p className='droppp'>Drop file or click select file</p>
        </>
        )}
        
        </div>

        {progress > 0 && (
    <div className="progress-container" style={{ width: '100%', backgroundColor: '#ddd' }}>
        <div className="progress-bar" style={{ width: `${progress}%`, height: '10px' }}></div>
    </div>
)}


        <section className='uploaded-row'>
            <>
            <ToggleButtonGroup
            activeButton={activeToggle} 
            onToggleChange={handleToggleChange} />
            </>
            <>
            {
                activeToggle === 'dimensions' ? (
                    <>
                    <input type = 'number' 
            className='input-width'
            value={Nwidth}
            max={19999}
            min={1} 
            placeholder='Width'
            onChange={handleWidthChange}/>

            <input type = 'number' 
            className='input-height'
            value={Nheight}
            max={19999}
            min={1} 
            placeholder='Height' 
            onChange={handleHeightChange} />
                </>
            ) : (
                <input type = 'number'
                className='input-percent'
                placeholder='%'
                value={percent}
                onChange={(e) => bypercent(e.target.value)}
                
                />
            )
            }
            
            </>
            
            <button className='resize-button' onClick={resizeFunc}>Resize</button>
            <button className='reset-button'onClick={resetFunc} >Reset</button>


        <FaDownload style={{cursor: !isDownDisabled ? 'not-allowed' : 'pointer',}} 
            onClick={downloadImage} size={25} disabled={!image} className="download-button"/>
            
            <span className='upload-content'>
            <>
            <FaFileImage className='fileimage' size={30}/>
            </>
                {fileName}
                <FaTrash
                className={`delete-button ${isShaking ? 'shake' : ''}`}
                id='delete-button'
                size={25}
                style={{cursor: !isDisabled ? 'not-allowed' : 'pointer',}}
                onClick={()=>handleDelete()}
                    
                />
            </span>
        </section>

        {previousSize.width > 0 && newSize.width > 0 && (
                <div className="size-info font-bold">
                    <p>Previous Size: {previousSize.width} x {previousSize.height} pixels</p>
                    <p>New Size: {newSize.width} x {newSize.height} pixels</p>
                </div>
            )}


    </main>
  );
}

export default Uploader