'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  XCircle,
  Eye
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  name: string
  lastName: string
  phone: string
  isAdmin: boolean
  createdAt: string
  questionsAnswered: number
  successRate: number
}

export default function AdminUsuariosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        // Carregar usuários do Firebase
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const usersData: UserData[] = []

        usersSnapshot.forEach((doc) => {
          const data = doc.data()
          usersData.push({
            id: doc.id,
            email: data.email || '',
            name: data.name || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            isAdmin: data.isAdmin || false,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            questionsAnswered: 0, // TODO: Implementar contagem real
            successRate: 0 // TODO: Implementar cálculo real
          })
        })

        setUsers(usersData)
        console.log(`✅ ${usersData.length} usuários carregados do Firebase`)
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error)
        // Fallback para dados mockados em caso de erro
        const mockUsers: UserData[] = [
          {
            id: '1',
            email: 'stadm@administrativo.com',
            name: 'Administrador',
            lastName: 'Sistema',
            phone: '(11) 99999-9999',
            isAdmin: true,
            createdAt: '2025-01-01',
            questionsAnswered: 0,
            successRate: 0
          }
        ]
        setUsers(mockUsers)
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleAdmin = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId)
      if (!userToUpdate) return

      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        isAdmin: !userToUpdate.isAdmin
      })

      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
      ))

      // Atualizar também o usuário selecionado no modal se estiver aberto
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, isAdmin: !selectedUser.isAdmin })
      }
    } catch (error) {
      console.error('Erro ao atualizar permissões de admin:', error)
      alert('Erro ao atualizar permissões de admin')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(users.filter(u => u.id !== userId))
      setShowModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      alert('Erro ao excluir usuário')
    }
  }

  const viewUserDetails = (userData: UserData) => {
    setSelectedUser(userData)
    setShowModal(true)
  }

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3347]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF3347] mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Painel
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-[#FF3347]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gerenciar Usuários
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {users.length > 0 ? (
              <>Total de {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</>
            ) : (
              <>Carregando usuários do Firebase...</>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#FF3347] focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Users Table */}
        {!loadingUsers && users.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Questões
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Taxa
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((userData) => (
                  <tr 
                    key={userData.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF3347] to-[#3D5AFE] flex items-center justify-center text-white font-bold">
                          {userData.name[0]}{userData.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.name} {userData.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Desde {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {userData.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {userData.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {userData.questionsAnswered}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`font-semibold ${
                        userData.successRate >= 80 ? 'text-green-600' :
                        userData.successRate >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {userData.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleAdmin(userData.id)}
                        className={`p-2 rounded-lg transition-all ${
                          userData.isAdmin
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={userData.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                      >
                        {userData.isAdmin ? (
                          <Shield className="h-5 w-5" />
                        ) : (
                          <ShieldOff className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewUserDetails(userData)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-[#3D5AFE] rounded-lg hover:bg-blue-200 transition-all"
                          title="Ver Detalhes"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => alert('Edição em desenvolvimento')}
                          className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteUser(userData.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-[#FF3347] rounded-lg hover:bg-red-200 transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {loadingUsers && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF3347] mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Carregando usuários...
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Buscando dados do Firebase
            </p>
          </div>
        )}

        {!loadingUsers && users.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Nenhum usuário cadastrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ainda não há usuários registrados no sistema
            </p>
          </div>
        )}

        {users.length > 0 && filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum usuário encontrado com &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalhes do Usuário
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar e Nome */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#FF3347] to-[#3D5AFE] flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name[0]}{selectedUser.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.phone}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cadastro</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Questões</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.questionsAnswered}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa de Acerto</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.successRate}%
                  </p>
                </div>
              </div>

              {/* Status Admin */}
              <div className={`rounded-lg p-4 flex items-center gap-3 ${
                selectedUser.isAdmin
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {selectedUser.isAdmin ? (
                  <>
                    <Shield className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-400">
                        Administrador
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-500">
                        Este usuário possui permissões administrativas
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-400">
                        Usuário Padrão
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-500">
                        Sem permissões administrativas
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/admin/historico?userId=${selectedUser.id}`)}
                  className="flex-1 py-3 bg-[#3D5AFE] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Ver Questões
                </button>
                <button
                  onClick={() => toggleAdmin(selectedUser.id)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    selectedUser.isAdmin
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {selectedUser.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
