'use client';
import {
  Paper,
  Grid,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  
} from '@mui/material';
import Box from '@mui/material/Box';
import {getWard,UpdateWard,InsertWards,UpdateWard_status} from "@/app/services/services"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, { useState, useEffect } from 'react';
import BaseCard from '@/app/(DashboardLayout)/components/shared/BaseCard';
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Alert from '@mui/material/Alert';
const Wards = () => {
  const [wardData, setWardData] = useState<{ id: number; wardName: string; remarks: string; status: number }[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ id: 0, wardName: "", remarks: "" }); // เก็บข้อมูลฟอร์ม
  const [headStatus, setheadStatus] = useState(0);
  const [headMessage, setheadMessage] = useState<string | null>(null);
  const [id, setId] = useState("");
  const style = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const fetchWardData = async () => {
    try {
      const res = await getWard(); 
      setWardData(res.data); 
    } catch (error: any) {
      setError(error.message || "Error occurred while fetching data");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchWardData(); 
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleSubmit = async () => {
    // เพิ่มฟังก์ชันที่คุณต้องการทำเมื่อกดปุ่ม OK เช่น ส่งข้อมูล
    console.log("Submitted:", formData);
    if (headStatus == 1) {

        if (!formData.wardName.trim() || !formData.remarks.trim()) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Ward Name and Remarks are required!",
              });
              return; // ออกจากฟังก์ชัน หากข้อมูลไม่ถูกต้อง

          }
          else
          {
            console.log("Submitted:", formData);
            const res = await InsertWards(
              formData.wardName,
              formData.remarks,
              1,
              1
            );
            console.log("api res", res.data); // res.data คือข้อมูลที่ได้จาก server
      
            if (res && res.data) {
              const { success, message, wardId } = res.data;
              if (success) {
                fetchWardData();
                showSuccessAlert(message + " ID : " + wardId);
              }
            } else {
            }
          }
     
    } else {

      const res = await UpdateWard(
        formData.id,
        formData.wardName,
        formData.remarks,
        1
      );
      console.log("api res", res.data); // res.data คือข้อมูลที่ได้จาก server
      if (res && res.data) {
        const { success, message, wardId } = res.data;
        if (success) {
          fetchWardData();
          showSuccessAlert(message + " ID : " + wardId);
        }
      }
    }

    // ปิด Modal หลังจากกดปุ่ม OK
    setOpen(false); // ปิด Modal
  };

  const handleAdd = () => {
    setheadMessage("เพิ่ม Ward");
    setheadStatus(1);
    setFormData({ id: 0, wardName: "", remarks: "" }); 
    setOpen(true);
  };

  const showSuccessAlert = (message : string) => {
    toast.success(message, {
      position: "top-center", // ใช้ตำแหน่งกลางด้านบน
      autoClose: 1500, // ปิดอัตโนมัติหลังจาก 2 วินาที
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

//   const handleModify = (ward) => {
//     const ward = wardData.find((ward) => ward.id === id); // หา Ward ที่ต้องการแก้ไข
//     setId(id);
//     setheadMessage("แก้ไข Ward เลขที่ " + id);
//     setheadStatus(2);
//     setFormData({ wardName: ward.wardName, description: ward.remarks }); // ตั้งค่า formData
//     setOpen(true);
//   };

const handleModify =  (ward: { id: number; wardName: string; remarks: string; status: number }) => {
    setFormData({
      id: ward.id,
      wardName: ward.wardName,
      remarks: ward.remarks,
    });
    setheadStatus(0); // ใช้สำหรับการแก้ไข
    setOpen(true); // เปิด Modal
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        const ward = wardData.find((ward) => ward.id === id); // หา Ward ที่ต้องการแก้ไข
        if (!ward) {
          Swal.fire("Error", "Ward not found!", "error");
          return;
        }
  
        const res = await UpdateWard_status(id, 0, 1); // เรียก API เพื่ออัปเดตสถานะ
        console.log("api res", res.data);
  
        if (res && res.data) {
          const { success, message, wardId } = res.data;
          if (success) {
            fetchWardData(); // โหลดข้อมูลใหม่หลังจากแก้ไขสำเร็จ
            showSuccessAlert(message + " ID : " + wardId);
          }
        }
      } catch (error) {
        console.error("Error deleting ward:", error);
        Swal.fire("Error", "Failed to delete ward. Please try again.", "error");
      }
    }
  };
  

  return (
    
    <Grid container spacing={3}>
       <h1>Ward Information</h1>
        <div>
             {/* ตัวจัดการแสดง Toast */}
        <ToastContainer />
        </div>
      <Grid item xs={12} lg={12}>
        <BaseCard title="Ward Management">
          <Stack spacing={3}>
            <Button variant="contained" onClick={handleAdd}>
              Add Ward
            </Button>
            <TextField id="name-basic" label="Search Wards" variant="outlined" />

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {loading ? (
                <Typography sx={{ p: 3 }} align="center">
                  Loading...
                </Typography>
              ) : error ? (
                <Typography sx={{ p: 3 }} color="error" align="center">
                  {error}
                </Typography>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Remarks</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {wardData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((ward) => (
                            <TableRow hover key={ward.id}>
                              <TableCell>{ward.id}</TableCell>
                              <TableCell>{ward.wardName}</TableCell>
                              <TableCell>{ward.remarks}</TableCell>
                              <TableCell>
          {/* ปุ่มแก้ไข */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => handleModify(ward)}
          >
            Edit
          </Button>
          {/* ปุ่มลบ */}
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(ward.id)}
          >
            Delete
          </Button>
        </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={wardData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </Paper>

            {/* Modal */}
       {/* Modal */}
<Modal
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
 
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Ward Information
    </Typography>
    <Stack spacing={3} sx={{ mt: 2 }}>
      <TextField
        id="wardname"
        label="Ward Name"
        variant="standard"
        value={formData.wardName} // ดึงค่าจาก formData
        onChange={(e) => setFormData({ ...formData, wardName: e.target.value })} // อัปเดตค่าใน formData
      />
      <TextField
        id="remarks"
        label="Remarks"
        variant="standard"
        value={formData.remarks} // ดึงค่าจาก formData
        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} // อัปเดตค่าใน formData
      />
      <Button
        variant="contained"
        onClick={() => {handleSubmit()}}
      >
        Save
      </Button>
    </Stack>
  </Box>
</Modal>

          </Stack>
        </BaseCard>
      </Grid>
    </Grid>

    
  );
};

export default Wards;