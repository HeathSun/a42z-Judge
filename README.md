This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 解决方法

### 1. **只保留 public/favicon.ico，不要在 app 目录下有同名文件或 route**

- **public/favicon.ico**：这是推荐方式，所有浏览器都支持。
- **不要在 `app/` 目录下有 `app/favicon.ico`、`app/favicon.png`、`app/icon.png`、`app/icon.tsx` 等文件**，否则会和 public 下的 favicon 冲突。

### 2. **删除 app 目录下的 favicon 相关文件**

- 检查 `app/` 目录下是否有 `favicon.ico`、`favicon.png`、`icon.png`、`icon.tsx` 等文件，如果有，全部删除，只保留 `public/favicon.ico`。

### 3. **metadata 配置可以保留或删除**

- 你可以在 `app/layout.tsx` 的 metadata 里写：
  ```js
  icons: {
    icon: "/favicon.ico"
  }
  ```
- 但只要 public 下有 favicon.ico，Next.js 会自动使用，无需额外配置。

### 4. **重启开发服务器或重新部署**

---

## 参考

- [官方文档：Conflicting public file and page file](https://nextjs.org/docs/messages/conflicting-public-file-page)
- [App Router favicon 说明](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)

---

## 总结

- **只保留 public/favicon.ico**
- **删除 app/ 目录下所有 favicon/icon 相关文件**
- **重启项目**

这样就不会再有冲突，favicon.ico 会被正确加载。

如需自动检测或批量删除 app 目录下的 icon 文件，请告知！
