// src/components/PdfViewerModalMui.js

import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
// Import các component từ Material-UI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

const InHoaDon = ({ isOpen, onClose, hoaDonId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Phần logic fetch dữ liệu giữ nguyên, không thay đổi ---
  useEffect(() => {
    if (isOpen && hoaDonId) {
      setIsLoading(true);
      setError(null);
      const fetchPdf = async () => {
        try {
          const apiUrl = `http://localhost:8080/api/hoa-don/${hoaDonId}/pdf`;
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('Không thể tải hóa đơn.');
          
          const pdfBlob = await response.blob();
          const newPdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(newPdfUrl);

        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPdf();
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hoaDonId]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth={true}
      maxWidth="lg" // Có thể chọn 'md', 'lg', 'xl' cho phù hợp
    >
      <DialogTitle>
        Hóa đơn chi tiết
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ height: '80vh' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <p style={{ color: 'red' }}>Lỗi: {error}</p>
            </Box>
        )}
        {pdfUrl && !error && (
          <iframe
            src={pdfUrl}
            title={`Hóa đơn ${hoaDonId}`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
InHoaDon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hoaDonId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};
export default InHoaDon;