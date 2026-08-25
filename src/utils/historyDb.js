/**
 * Quản lý lưu trữ danh sách hồ sơ lá số tử vi đã xem trong IndexedDB
 */

const DB_NAME = 'TuViAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'savedProfiles';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Lấy tất cả hồ sơ đã lưu, sắp xếp theo thời gian xem gần nhất
 */
export async function getAllProfiles() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sắp xếp giảm dần theo thời gian xem
        const sorted = (request.result || []).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(sorted);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching profiles from IndexedDB:', error);
    return [];
  }
}

/**
 * Lưu hoặc cập nhật thông tin form nhập vào IndexedDB
 * Chỉ lưu các trường cần fill: { name, gender, solarDay, solarMonth, solarYear, hourChiIndex, viewYear }
 */
export async function saveProfile(formData) {
  try {
    const db = await openDB();
    const profiles = await getAllProfiles();
    
    // Tìm hồ sơ trùng khớp (theo tên, ngày tháng năm sinh, giờ sinh, giới tính)
    const existing = profiles.find(p => 
      p.name?.trim().toLowerCase() === formData.name?.trim().toLowerCase() &&
      parseInt(p.solarDay) === parseInt(formData.solarDay) &&
      parseInt(p.solarMonth) === parseInt(formData.solarMonth) &&
      parseInt(p.solarYear) === parseInt(formData.solarYear) &&
      parseInt(p.hourChiIndex) === parseInt(formData.hourChiIndex) &&
      p.gender === formData.gender
    );

    const profileData = {
      name: formData.name || 'Vô Danh',
      gender: formData.gender || 'nam',
      solarDay: parseInt(formData.solarDay),
      solarMonth: parseInt(formData.solarMonth),
      solarYear: parseInt(formData.solarYear),
      hourChiIndex: parseInt(formData.hourChiIndex),
      viewYear: parseInt(formData.viewYear) || new Date().getFullYear(),
      updatedAt: Date.now()
    };

    if (existing) {
      profileData.id = existing.id;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = profileData.id ? store.put(profileData) : store.add(profileData);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving profile to IndexedDB:', error);
  }
}

/**
 * Xóa một hồ sơ theo id
 */
export async function deleteProfile(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
}

/**
 * Xóa toàn bộ lịch sử đã lưu
 */
export async function clearAllProfiles() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing profiles:', error);
    return false;
  }
}
