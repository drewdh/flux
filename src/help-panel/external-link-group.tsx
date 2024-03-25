import Icon from '@cloudscape-design/components/icon';

export default function ExternalLinkGroup({ links }: Props) {
  return (
    <div>
      <h3>
        Learn more <Icon name="external" />
      </h3>
      <ul>
        {links.map((link) => {
          return (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer" target="_blank">
                {link.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface Props {
  links: Array<{
    text: string;
    href: string;
  }>;
}
