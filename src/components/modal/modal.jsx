import { useEffect } from 'react';
import './modal.scss';
import CustomButton from '../button/custom-button';

const Modal = ({modalContent, close, modalError}) => {

    const {header, messages} = modalContent;
    useEffect(() => {
        const closeEsc = (e) => {
            if(e.keyCode === 27){
                close();
            }
        }
        window.addEventListener('keydown', closeEsc)
        return () => window.removeEventListener('keydown', closeEsc)
    },[])

    useEffect(() => {
          let modalTimer = setTimeout(close, 7000);
          return () => {
            clearTimeout(modalTimer);
          };
    }, []);
    

    const closeModal = (e)  => {
        if(e.target.className === "modal") {
            close();
        }
    }

    const generateModalContent = () => {
        return messages.map((message, idx) => {
            return <p key={idx}> {message} </p>
        })
    }

    return (
       <div className="modal" onClick={(e) => closeModal(e)}>
           <div className="modal-content">
               <div className={`${modalError ? 'error' : ''} modal-header`}>
                   <h4 className="model-title">{header}</h4>
               </div>
               <div className="modal-body">
                <span className="close" onClick={close}>&times;</span>
                {generateModalContent()}
               </div>
               <div className="modal-footer">
                    <CustomButton
                        onClick={close}
                        additionalClass="modal-btn">
                            OK
                    </CustomButton>
                </div>
           </div>
       </div> 
    )
}

export default Modal;