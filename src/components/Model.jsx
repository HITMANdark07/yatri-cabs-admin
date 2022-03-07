import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';

const ModelComp = ({open, setOpen, children}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        minHeight:'60vh',
        maxHeight:'90vh',
        overflowY:'scroll',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return(
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                {children}
            </Box>
        </Modal>
    )
}

export default ModelComp;