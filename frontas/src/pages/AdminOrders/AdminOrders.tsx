import React, { useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { CheckCircle, Cancel, Receipt, PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';

interface User {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  phrase: string;
  group: string;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

interface PhotoshootInfo {
  groupName: string;
  location: string;
  date: string;
  time: string;
  faculty: string;
  yearOfEntry: number;
  yearOfGraduation: number;
  university: string;
  elder: string;
  members: User[];
  status: 'pending' | 'confirmed' | 'cancelled';
  invoice: Invoice;
}

const mockPhotoshootData: PhotoshootInfo[] = [
  {
    groupName: 'Kompiuterių Mokslai 2022',
    location: 'Studija 1',
    date: '2024-08-30',
    time: '10:00',
    faculty: 'Inžinerija ir Informatika',
    yearOfEntry: 2018,
    yearOfGraduation: 2022,
    university: 'Vilniaus Universitetas',
    elder: 'Jonas Jonaitis',
    members: [
      { name: 'Jonas', surname: 'Jonaitis', email: 'jonas.jonaitis@example.com', telephone: '+37060000000', phrase: 'Fotografija', group: 'Kompiuterių Mokslai 2022' },
      { name: 'Ona', surname: 'Onaitė', email: 'ona.onaite@example.com', telephone: '+37060000002', phrase: 'Portretas', group: 'Kompiuterių Mokslai 2022' },
    ],
    status: 'pending',
    invoice: {
      invoiceNumber: 'INV-2024-001',
      date: '2024-08-30',
      items: [
        { description: 'Photoshoot Session', quantity: 1, price: 200 },
        { description: 'Individual Photos', quantity: 2, price: 50 },
      ],
      total: 300,
    },
  },
  {
    groupName: 'Menas ir Dizainas 2023',
    location: 'Lauko Parkas',
    date: '2024-08-31',
    time: '14:00',
    faculty: 'Menai',
    yearOfEntry: 2019,
    yearOfGraduation: 2023,
    university: 'Kauno Technologijos Universitetas',
    elder: 'Petras Petraitis',
    members: [
      { name: 'Petras', surname: 'Petraitis', email: 'petras.petraitis@example.com', telephone: '+37060000001', phrase: 'Studija', group: 'Menas ir Dizainas 2023' },
      { name: 'Kazys', surname: 'Kazlauskas', email: 'kazys.kazlauskas@example.com', telephone: '+37060000003', phrase: 'Lauko fotografija', group: 'Menas ir Dizainas 2023' },
    ],
    status: 'confirmed',
    invoice: {
      invoiceNumber: 'INV-2024-002',
      date: '2024-08-31',
      items: [
        { description: 'Photoshoot Session', quantity: 1, price: 250 },
        { description: 'Individual Photos', quantity: 2, price: 60 },
      ],
      total: 370,
    },
  },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<PhotoshootInfo[]>(mockPhotoshootData);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleConfirmOrder = (index: number) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = 'confirmed';
    setOrders(updatedOrders);
  };

  const handleCancelOrder = (index: number) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = 'cancelled';
    setOrders(updatedOrders);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseInvoice = () => {
    setSelectedInvoice(null);
  };

  const handleDownloadInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Faktūra: ${invoice.invoiceNumber}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Data: ${invoice.date}`, 10, 20);
    
    let yPosition = 30;

    doc.text(`Aprašymas`, 10, yPosition);
    doc.text(`Kiekis`, 100, yPosition);
    doc.text(`Kaina`, 150, yPosition);

    yPosition += 10;

    invoice.items.forEach((item) => {
      doc.text(item.description, 10, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`${item.price} €`, 150, yPosition);
      yPosition += 10;
    });

    yPosition += 10;
    doc.text(`Viso: ${invoice.total} €`, 10, yPosition);

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Užsakymų Peržiūra
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Grupė</TableCell>
              <TableCell>Data ir Laikas</TableCell>
              <TableCell>Vieta</TableCell>
              <TableCell>Fakultetas</TableCell>
              <TableCell>Universitetas</TableCell>
              <TableCell>Įstojimo/Baigimo Metai</TableCell>
              <TableCell>Grupės Seniūnas / Narių Skaičius</TableCell>
              <TableCell>Statusas</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.groupName}</TableCell>
                <TableCell>{order.date} {order.time}</TableCell>
                <TableCell>{order.location}</TableCell>
                <TableCell>{order.faculty}</TableCell>
                <TableCell>{order.university}</TableCell>
                <TableCell>{order.yearOfEntry} / {order.yearOfGraduation}</TableCell>
                <TableCell>{order.elder} / {order.members.length} nariai</TableCell>
                <TableCell>{order.status === 'pending' ? 'Laukiama' : order.status === 'confirmed' ? 'Patvirtinta' : 'Atšaukta'}</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={() => handleConfirmOrder(index)}
                        disabled={order.status !== 'pending'}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="secondary"
                        onClick={() => handleCancelOrder(index)}
                        disabled={order.status !== 'pending'}
                      >
                        <Cancel />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="default"
                        onClick={() => handleViewInvoice(order.invoice)}
                      >
                        <Receipt />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="default"
                        onClick={() => handleDownloadInvoicePDF(order.invoice)}
                      >
                        <PictureAsPdf />
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(selectedInvoice)} onClose={handleCloseInvoice}>
        <DialogTitle>Faktūra</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <div>
              <Typography variant="subtitle1">Faktūros Nr.: {selectedInvoice.invoiceNumber}</Typography>
              <Typography variant="subtitle1">Data: {selectedInvoice.date}</Typography>
              <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Aprašymas</TableCell>
                      <TableCell>Kiekis</TableCell>
                      <TableCell>Kaina</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price} €</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}><strong>Viso:</strong></TableCell>
                      <TableCell><strong>{selectedInvoice.total} €</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
