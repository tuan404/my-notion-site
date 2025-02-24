import * as React from 'react'

// Import helper function
import * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnySharp } from '@react-icons/all-files/io5/IoSunnySharp'
import cs from 'classnames'
import { getPageProperty } from 'notion-utils'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
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
  const { recordMap } = useNotionContext() // Get the Notion record map
  const { components, mapPageUrl } = useNotionContext()

  const sanitizedCurrentPageId = pageId ? pageId.replace(/-/g, '') : ''

  // Ensure the pageBlock exists and recordMap contains data for this page ID
  const pageBlock = recordMap?.block?.[sanitizedCurrentPageId]?.value

  // If pageBlock exists, get the title, otherwise fallback
  const title = pageBlock
    ? getPageProperty('title', pageBlock, recordMap) || 'Untitled Page'
    : 'Untitled Page'

  // Log the current page ID and title
  console.log('PageId:', sanitizedCurrentPageId, 'title:', title)

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              const sanitizedLinkPageId = link.pageId?.replace(/-/g, '')

              console.log(
                'sanitizedLinkPageId: ',
                sanitizedLinkPageId,
                'title: ',
                link.title
              )

              const isActive = sanitizedLinkPageId === sanitizedCurrentPageId

              return (
                <div
                  key={index}
                  className={cs('breadcrumb-wrapper', {
                    isActive // Apply the isActive class to the div
                  })}
                >
                  {link.pageId ? (
                    <components.PageLink
                      href={mapPageUrl(link.pageId)}
                      className={cs(styles.navLink, 'breadcrumb', 'button')}
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
