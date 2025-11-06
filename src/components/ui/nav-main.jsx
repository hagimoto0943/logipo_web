"use client"

import { ChevronRight } from "lucide-react"

import { cn } from "@lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@components/ui/sidebar"

export function NavMain({ items }) {
  return (
    <SidebarGroup className="gap-3 p-0">
      <SidebarMenu className="gap-2">
        {items.map((item) => {
          const hasChildren = Array.isArray(item.items) && item.items.length > 0
          const isActive = Boolean(item.isActive)

          const buttonClasses = cn(
            "flex h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold leading-[1.4] text-slate-600 transition-all",
            "hover:bg-white/70 hover:text-slate-900",
            "data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:shadow-sm",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0",
            hasChildren ? "pr-2" : "pr-3"
          )

          const chevronClasses = cn(
            "ml-auto size-4 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
            "group-data-[state=open]/collapsible:translate-x-0.5 group-data-[state=open]/collapsible:text-primary"
          )

          const iconClasses = cn(
            "size-[22px] shrink-0 text-slate-500 transition-colors duration-200",
            "group-hover/menu-item:text-primary",
            isActive && "text-primary"
          )

          if (hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible">
                <SidebarMenuItem className="group/menu-item px-0">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={buttonClasses}
                      isActive={item.isActive}
                      size="lg"
                      tooltip={item.title}>
                      {item.icon && (
                        <item.icon
                          strokeWidth={isActive ? 2.4 : 2.2}
                          className={iconClasses}
                          aria-hidden />
                      )}
                      <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      <ChevronRight className={chevronClasses} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1.5">
                    <SidebarMenuSub className="mx-0 border-0 px-0 py-0">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.isActive}
                          className="h-9 rounded-lg pl-12 pr-4 text-[13px] font-medium leading-6 text-slate-500 transition hover:bg-white/70 hover:text-slate-900 data-[active=true]:bg-white data-[active=true]:text-slate-900">
                            <a href={subItem.url}>
                              <span className="truncate">{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title} className="group/menu-item px-0">
              <SidebarMenuButton
                className={buttonClasses}
                isActive={item.isActive}
                size="lg"
                tooltip={item.title}
                asChild>
                <a href={item.url} aria-current={isActive ? "page" : undefined}>
                  {item.icon && (
                    <item.icon
                      strokeWidth={isActive ? 2.4 : 2.2}
                      className={iconClasses}
                      aria-hidden />
                  )}
                  <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
