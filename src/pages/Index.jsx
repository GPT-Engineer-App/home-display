import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Flex, Input, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";

const API_URL = "https://backengine-o3nw.fly.dev";

const Index = () => {
  const [homes, setHomes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await fetch(`${API_URL}/homes`);
      const data = await response.json();
      setHomes(data);
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl">
          <FaHome /> Home Listings
        </Heading>
        {isLoggedIn ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Flex>
            <FormControl id="email" mr={2}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" mr={2}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button onClick={handleLogin}>Login</Button>
          </Flex>
        )}
      </Flex>
      {homes.map((home, index) => (
        <Box key={index} p={4} mb={4} borderWidth={1} borderRadius="md">
          <Heading as="h2" size="lg" mb={2}>
            {home.title}
          </Heading>
          <Text>{home.description}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default Index;
