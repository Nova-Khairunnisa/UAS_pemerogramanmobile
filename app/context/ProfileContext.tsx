import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Profile = {
  nama: string;
  mahasiswa: boolean;
  setuju: boolean;
  photo: string | null;
};

const ProfileContext = createContext<any>(null);

export function ProfileProvider({ children }: any) {
  const [profile, setProfile] = useState<Profile>({
    nama: '',
    mahasiswa: false,
    setuju: false,
    photo: null,
  });

  /* LOAD */
  useEffect(() => {
    AsyncStorage.getItem('profile').then((res) => {
      if (res) setProfile(JSON.parse(res));
    });
  }, []);

  /* SAVE */
  useEffect(() => {
    AsyncStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
