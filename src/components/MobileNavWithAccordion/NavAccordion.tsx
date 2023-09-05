import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react'
import { ElementType, ReactNode } from 'react'
import { NavData } from './data'

type NavLinkProps = {
  href: string
  icon: ElementType
  children: ReactNode
}

const NavLink = (props: NavLinkProps) => {
  const { href, icon, children } = props
  return (
    <Link href={href} _hover={{ textDecoration: 'none' }}>
      <HStack py="3" spacing="3">
        <Icon color="accent" as={icon} fontSize="xl" />
        <Text fontWeight="medium">{children}</Text>
      </HStack>
    </Link>
  )
}

type NavAccordionProps = {
  data: NavData
}

export const NavAccordion = (props: NavAccordionProps) => {
  const { data } = props
  return (
    <Accordion allowMultiple as="ul" listStyleType="none">
      {data.map((group) => (
        <AccordionItem key={group.title} as="li">
          <AccordionButton py="3" px="0">
            <Box flex="1" textAlign="start" fontSize="lg" fontWeight="semibold">
              {group.title}
            </Box>
            <AccordionIcon fontSize="3xl" />
          </AccordionButton>
          <AccordionPanel pb="3" px="0" pt="0">
            {group.items.map((item, index) => (
              <NavLink key={index} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
