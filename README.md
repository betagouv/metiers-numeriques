# Le site de metiers-numeriques

## Lancer en prod

```
npm start
```

Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

## Tester que le HTML d'un site est valide

```
yarn checkHTML --  <url du site à tester>
```

Si on veut checker pour une PR donnée, utiliser l'url de la review app de la PR (voir les checks dans la PR).

## Lancer ce site localement

Vous devez avoir npm et yarn installé sur votre machine.

```
git clone https://github.com/betagouv/metiers-numeriques
cd metiers-numeriques
yarn
yarn dev
```

## Mettre à jour le Design System

- Modifier la version de @gouvfr/dsfr dans package.json
- Lancer la commande :

```
yarn
```

## IDE

### Visual Studio Code

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.codeActionsOnSave.mode": "all",
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
