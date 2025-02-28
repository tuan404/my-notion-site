import * as React from 'react'

// Import helper function
import * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnySharp } from '@react-icons/all-files/io5/IoSunnySharp'
import cs from 'classnames'
import { Header, PageIcon, Search, useNotionContext } from 'react-notion-x'

import {
  isSearchEnabled,
  name,
  navigationLinks,
  navigationStyle,
  rootNotionPageId
} from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoSunnySharp /> : <IoMoonSharp />}
    </div>
  )
}

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
  pageId: string
}> = ({ block, pageId }) => {
  const { recordMap, components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  const currentPageId = pageId?.replace(/-/g, '')

  // Get root block specifically
  const rootBlock = recordMap?.block?.[rootNotionPageId]?.value

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <div className='breadcrumb'>
          <components.PageLink
            href={mapPageUrl(rootNotionPageId)}
            className={cs(styles.navLink, 'breadcrumb')}
          >
            {rootBlock && (
              <span className='notion-page-icon-inline'>
                <PageIcon block={rootBlock} />
              </span>
            )}
            <span className='notion-page-title'>{name}</span>
          </components.PageLink>
        </div>

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              const linkPageId = link.pageId?.replace(/-/g, '')
              const isActive = linkPageId === currentPageId

              return (
                <div
                  key={index}
                  className={cs('breadcrumb-wrapper', {
                    active: isActive,
                    isActive: isActive
                  })}
                >
                  {link.pageId ? (
                    <components.PageLink
                      href={mapPageUrl(link.pageId)}
                      className={cs(styles.navLink, 'breadcrumb', 'button', {
                        active: isActive
                      })}
                    >
                      {link.title}
                    </components.PageLink>
                  ) : (
                    <components.Link
                      href={link.url}
                      className={cs(styles.navLink, 'breadcrumb', 'button')}
                    >
                      {link.title}
                    </components.Link>
                  )}
                </div>
              )
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
