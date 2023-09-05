import { ElementType } from 'react'
import {
  FiAlertOctagon,
  FiBarChart,
  FiBook,
  FiBookOpen,
  FiBriefcase,
  FiCompass,
  FiHome,
  FiLock,
  FiPackage,
  FiPenTool,
} from 'react-icons/fi'
import { HiOutlineChatAlt, HiOutlineGlobe } from 'react-icons/hi'

export type NavData = Array<{
  title: string
  items: Array<{ icon: ElementType; label: string; href: string }>
}>

export const data: NavData = [
  {
    title: 'Product',
    items: [
      { icon: FiCompass, label: 'Product tour', href: '#' },
      { icon: FiBook, label: 'Changelog', href: '#' },
      { icon: HiOutlineChatAlt, label: 'Feedback', href: '#' },
      { icon: FiPackage, label: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Features',
    items: [
      { icon: HiOutlineGlobe, label: 'Domain analysis', href: '#' },
      { icon: FiBarChart, label: 'Analytics', href: '#' },
    ],
  },
  {
    title: 'Learn',
    items: [
      { icon: FiBookOpen, label: 'Guides', href: '#' },
      { icon: FiPenTool, label: 'Blog', href: '#' },
      { icon: HiOutlineChatAlt, label: 'Support', href: '#' },
      { icon: FiAlertOctagon, label: 'Updates', href: '#' },
    ],
  },
  {
    title: 'Company',
    items: [
      { icon: FiHome, label: 'About us', href: '#' },
      { icon: FiBriefcase, label: 'Careers', href: '#' },
      { icon: FiLock, label: 'Privacy', href: '#' },
    ],
  },
]
