import { messaging, getToken, onMessage } from "../firebase-config";

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: "BCNnYNKkWVkoy-VR6q0gWBFZBmZnMlobH4AFEDQ9oHo4UgRP72JLRFtTnVlZrNWEurntT5nwYjXaNp_T2-k0pJpE"
      });
      console.log('🔥 Token:', token);
      // احفظه في السيرفر أو بالـ localStorage حسب احتياجك
    } else {
      console.warn('🚫 الإذن مرفوض');
    }
  } catch (err) {
    console.error("❌ فشل الحصول على التوكن:", err);
  }
};

export const listenToMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('📬 تم استلام رسالة أثناء فتح الموقع:', payload);
    alert(`📢 ${payload.notification.title}: ${payload.notification.body}`);
  });
};
