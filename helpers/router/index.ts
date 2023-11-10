export const add = (key: string, value: string) => {
  push({
    query: {
      ...currentRoute.value.query,
      [key]: value,
    },
  })
}

export const remove = (key: string) => {
  const route = useRouter()

  const { currentRoute, push } = route
  const query = currentRoute.value.query
  delete query[key]
  push({
    query: {
      ...query,
    },
  })
}

export const reset = () => {
  const route = useRouter()

  const { currentRoute, push } = route
  push({
    query: {},
  })
}
