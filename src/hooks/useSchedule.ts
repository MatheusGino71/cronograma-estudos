import { useMemo } from 'react';
import { useScheduleStore } from '@/store/schedule';

export function useAdherence() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useMemo(() => {
    const totalBlocks = blocks.length;
    const completedBlocks = blocks.filter(b => b.completed).length;
    const adherence = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
    
    return {
      totalBlocks,
      completedBlocks,
      pendingBlocks: totalBlocks - completedBlocks,
      adherence
    };
  }, [blocks]);
}

export function useWeeklyStats() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyBlocks = blocks.filter(block => {
      const blockDate = new Date(block.date);
      return blockDate >= weekStart && blockDate <= weekEnd;
    });
    
    const completedThisWeek = weeklyBlocks.filter(b => b.completed);
    const plannedMinutes = weeklyBlocks.reduce((sum, block) => {
      const start = new Date(`2000-01-01T${block.start}`);
      const end = new Date(`2000-01-01T${block.end}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    
    const completedMinutes = completedThisWeek.reduce((sum, block) => {
      const start = new Date(`2000-01-01T${block.start}`);
      const end = new Date(`2000-01-01T${block.end}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    
    return {
      plannedHours: Math.round(plannedMinutes / 60 * 10) / 10,
      completedHours: Math.round(completedMinutes / 60 * 10) / 10,
      plannedBlocks: weeklyBlocks.length,
      completedBlocks: completedThisWeek.length
    };
  }, [blocks]);
}

export function useStudyStreak() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useMemo(() => {
    const sortedBlocks = [...blocks]
      .filter(b => b.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedBlocks.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const block of sortedBlocks) {
      const blockDate = new Date(block.date);
      blockDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - blockDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = blockDate;
      } else {
        break;
      }
    }
    
    return streak;
  }, [blocks]);
}

export function useDisciplineProgress() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useMemo(() => {
    const disciplineStats = blocks.reduce((acc, block) => {
      if (!acc[block.disciplineId]) {
        acc[block.disciplineId] = {
          total: 0,
          completed: 0,
          studyBlocks: 0,
          reviewBlocks: 0,
          simulationBlocks: 0
        };
      }
      
      acc[block.disciplineId].total++;
      if (block.completed) acc[block.disciplineId].completed++;
      
      switch (block.type) {
        case 'Estudo':
          acc[block.disciplineId].studyBlocks++;
          break;
        case 'Revisão':
          acc[block.disciplineId].reviewBlocks++;
          break;
        case 'Simulado':
          acc[block.disciplineId].simulationBlocks++;
          break;
      }
      
      return acc;
    }, {} as Record<string, {
      total: number;
      completed: number;
      studyBlocks: number;
      reviewBlocks: number;
      simulationBlocks: number;
    }>);
    
    return disciplineStats;
  }, [blocks]);
}

export function useNotifications() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };
  
  const scheduleNotification = (block: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const blockDateTime = new Date(`${block.date}T${block.start}`);
      const now = new Date();
      const timeDiff = blockDateTime.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        setTimeout(() => {
          new Notification(`Hora de estudar: ${block.title}`, {
            body: `${block.type} - ${block.start} às ${block.end}`,
            icon: '/favicon.ico'
          });
        }, timeDiff);
      }
    }
  };
  
  const scheduleTodayNotifications = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayBlocks = blocks.filter(b => b.date === today && !b.completed);
    
    todayBlocks.forEach(scheduleNotification);
  };
  
  return {
    requestPermission,
    scheduleNotification,
    scheduleTodayNotifications
  };
}
