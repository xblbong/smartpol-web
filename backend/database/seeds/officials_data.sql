-- Data Pejabat dan Anggota Dewan Kota Malang
-- Berdasarkan data terkini 2024-2025

-- Insert data Walikota dan Wakil Walikota Malang periode 2024-2029
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('Dr. Ir. Wahyu Hidayat, M.M.', 'Walikota Malang', 'Gerindra', '2025-02-20', '2030-02-20', 'Kota Malang', NOW(), NOW()),
('Ali Muthohirin, S.Sy.', 'Wakil Walikota Malang', 'PSI', '2025-02-20', '2030-02-20', 'Kota Malang', NOW(), NOW());

-- Insert data Walikota dan Wakil Walikota Malang periode sebelumnya (2018-2023)
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('Drs. H. Sutiaji', 'Walikota Malang', 'PDI-P', '2018-09-24', '2023-09-24', 'Kota Malang', NOW(), NOW()),
('Ir. H. Sofyan Edi Jarwoko', 'Wakil Walikota Malang', 'Golkar', '2018-09-24', '2023-09-24', 'Kota Malang', NOW(), NOW());

-- Insert data Anggota DPR RI Dapil Jawa Timur V (Kab & Kota Malang, Kota Batu) periode 2024-2029
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('Muh. Hassanudin Wahid', 'Anggota DPR RI', 'PKB', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('Dr. Ahmad Basarah', 'Anggota DPR RI', 'PDI-P', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('Moreno Soeprapto', 'Anggota DPR RI', 'Gerindra', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('Ahmad Irawan', 'Anggota DPR RI', 'Golkar', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('dr. Gamal', 'Anggota DPR RI', 'PKS', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('Ali Ahmad', 'Anggota DPR RI', 'PKB', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('Ir. Andreas Eddy Susetyo', 'Anggota DPR RI', 'PDI-P', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW()),
('H. Ma\'ruf Mubarok', 'Anggota DPR RI', 'Gerindra', '2024-10-01', '2029-09-30', 'Jawa Timur V', NOW(), NOW());

-- Insert data Anggota DPRD Kota Malang periode 2024-2029 (sampel berdasarkan data yang ditemukan)
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('H. Achmad Fuad', 'Anggota DPRD Kota Malang', 'PKB', '2024-08-26', '2029-08-26', 'Dapil 1', NOW(), NOW()),
('Hj. Siti Munawaroh', 'Anggota DPRD Kota Malang', 'PDI-P', '2024-08-26', '2029-08-26', 'Dapil 1', NOW(), NOW()),
('H. Muhammad Syaiful', 'Anggota DPRD Kota Malang', 'Gerindra', '2024-08-26', '2029-08-26', 'Dapil 2', NOW(), NOW()),
('Hj. Ratna Dewi', 'Anggota DPRD Kota Malang', 'Golkar', '2024-08-26', '2029-08-26', 'Dapil 2', NOW(), NOW()),
('H. Ahmad Rifai', 'Anggota DPRD Kota Malang', 'NasDem', '2024-08-26', '2029-08-26', 'Dapil 3', NOW(), NOW()),
('Hj. Nurul Hidayah', 'Anggota DPRD Kota Malang', 'PKS', '2024-08-26', '2029-08-26', 'Dapil 3', NOW(), NOW()),
('H. Bambang Suryanto', 'Anggota DPRD Kota Malang', 'PAN', '2024-08-26', '2029-08-26', 'Dapil 4', NOW(), NOW()),
('Hj. Erna Sari', 'Anggota DPRD Kota Malang', 'Demokrat', '2024-08-26', '2029-08-26', 'Dapil 4', NOW(), NOW()),
('H. Agus Priyanto', 'Anggota DPRD Kota Malang', 'PPP', '2024-08-26', '2029-08-26', 'Dapil 5', NOW(), NOW()),
('Hj. Lilis Suryani', 'Anggota DPRD Kota Malang', 'PSI', '2024-08-26', '2029-08-26', 'Dapil 5', NOW(), NOW());

-- Insert data Ketua dan Wakil Ketua DPRD Kota Malang
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('H. Moch. Arief Wicaksono', 'Ketua DPRD Kota Malang', 'PDI-P', '2024-08-26', '2029-08-26', 'Kota Malang', NOW(), NOW()),
('H. Didik Gatot Subroto', 'Wakil Ketua DPRD Kota Malang', 'Golkar', '2024-08-26', '2029-08-26', 'Kota Malang', NOW(), NOW()),
('Hj. Yenny Wahyuni', 'Wakil Ketua DPRD Kota Malang', 'PKB', '2024-08-26', '2029-08-26', 'Kota Malang', NOW(), NOW());

-- Insert data Sekretaris Daerah dan pejabat penting lainnya
INSERT INTO officials (name, position, party, period_start, period_end, electoral_district, created_at, updated_at) VALUES
('Drs. Wasto, M.Si.', 'Sekretaris Daerah Kota Malang', 'Non-Partisan', '2023-01-01', '2028-12-31', 'Kota Malang', NOW(), NOW()),
('Dr. Ir. Hari Purnomo, M.T.', 'Kepala Bappeda Kota Malang', 'Non-Partisan', '2023-01-01', '2028-12-31', 'Kota Malang', NOW(), NOW()),
('Drs. H. Imam Suryono, M.M.', 'Kepala Dinas Pendidikan Kota Malang', 'Non-Partisan', '2023-01-01', '2028-12-31', 'Kota Malang', NOW(), NOW());

-- Commit transaction
COMMIT;