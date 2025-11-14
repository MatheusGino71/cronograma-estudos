// Script para criar usuário administrativo no Firebase
// Execute: node scripts/create-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Configuração do Firebase (use as mesmas credenciais do projeto)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('Criando usuário administrativo...');
    
    const email = 'stadm@administrativo.com';
    const password = 'adm2714';
    
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuário criado no Firebase Auth:', user.uid);
    
    // Criar documento no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: 'Administrador',
      lastName: 'Sistema',
      phone: '(11) 99999-9999',
      email: email,
      avatar: '',
      isAdmin: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Documento criado no Firestore');
    console.log('\n✅ Usuário administrativo criado com sucesso!');
    console.log('Email:', email);
    console.log('Senha:', password);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  }
}

createAdminUser();
